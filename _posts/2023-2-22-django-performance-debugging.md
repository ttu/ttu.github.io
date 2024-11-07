---
layout: post
title: Debugging the Performance of Django Application (DRF)
excerpt: Investigation the root cause of poor performance of Django application and Django REST Framework (DRF).
---

Django may not be the fastest web framework available, but it remains a popular and reliable choice for many projects. Django REST Framework (DRF) is a powerful tool for building APIs, although it can slow down your application, if not used correctly.

According to a [Python REST frameworks performance comparison](https://www.grandmetric.com/python-rest-frameworks-performance-comparison/), DRF is the slowest of the tested frameworks, yet it can still handle over 500 requests per second. 

However, in some cases, the performance of a Django application and DRF may fall short of expectations. If you're experiencing poor performance with an authenticated Django DRF application, here's a guide on how to investigate the root cause of the issue.

### Create New Django Project

Create new DRF project (`todo`) and app (`todo_api`)

```sh
python -m venv .venv
source .venv/bin/activate
python -m pip install django
python -m pip install djangorestframework
django-admin startproject todo .
cd todo && django-admin startapp todo_api && cd ..
./manage.py migrate
./manage.py createsuperuser
```

Add to `settings.py`

```py
INSTALLED_APPS = [
    ...  # Make sure to include the default installed apps here.
    'rest_framework',
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
    ]
}
```

Add to `todo_api/views.py`

```py
from django.http import HttpResponse

from rest_framework.decorators import api_view

def hello_world(request):
    return HttpResponse("Hello world!")

@api_view()
def hello_world_drf(request):
    return HttpResponse("Hello world from DRF!")
```

Add to `urls.py`

```py
from django.urls import path

from todo.todo_api import views

urlpatterns = [
    path('hello/', views.hello_world),
    path('hello-drf/', views.hello_world_drf),
]
```

Make request to both endpoints with and without authentication

```sh
curl -w '\nTotal: %{time_total}s\n' http://127.0.0.1:8000/hello/
curl -w '\nTotal: %{time_total}s\n' http://127.0.0.1:8000/hello-drf/

Hello world!
Total: 0.003775s
Hello world from DRF!
Total: 0.004079s

curl -u 'admin:admin' -w '\nTotal: %{time_total}s\n' http://127.0.0.1:8000/hello/
curl -u 'admin:admin' -w '\nTotal: %{time_total}s\n' http://127.0.0.1:8000/hello-drf/

Hello world!
Total: 0.003339s
Hello world from DRF!
Total: 0.100578s
```

Requests without Authentication are under 5ms, so performance (200+ req/sec) is in same ballpark with REST frameworks performance comparison number (500+ req/sec).

Request with authentication to DRF endpoint takes 20 times longer than to non DRF endpoint (10 req/sec). Reason is how user is handled during the request.

Django uses `SimpleLazyObject` for request user.

![User Django](/images/posts/django-performance/user-django.png)

DRF uses `User` object for request user.

![User DRF](/images/posts/django-performance/user-drf.png)

Path to authentication-file with `BasicAuthentication` implementation.

e.g `/.venv/lib/python3.9/site-packages/rest_framework/authentication.py`or in [GitHub](https://github.com/encode/django-rest-framework/blob/4abfa28e0879e2df45937ac8c7a9ffa161561955/rest_framework/authentication.py#L53).

### Solution 1: Remove Authentication from Endpoint If Not Required

If authentication is not required for the endpoint, remove authentication by setting `authentication_classes` to an empty list.

```py
@api_view()
@authentication_classes([])
def hello_world_drf(request):
    return HttpResponse({"message": "Hello world from DRF!"})
```

![User anon](/images/posts/django-performance/user-anon.png)

Now unnecessary authentication is not done.

### Solution 2: Force DRF to Use Lazy Object for request.user

Check example from this GitHub issue on how to override DRF's `request.user` to return a lazy-object.

[https://github.com/encode/django-rest-framework/issues/6002](https://github.com/encode/django-rest-framework/issues/6002)

![User lazy](/images/posts/django-performance/user-lazy.png)

Request is now faster, as user is not accessed during any point during request

```py
@api_view()
def hello_world_drf(request):
    # print(request.user.email)
    return HttpResponse({"message": "Hello world from DRF!"})
```

### Solution 3: Something Else?

Let’s dig into authentication a figure out why is so slow.

Create a custom authentication method that enables for code-level debugging to identify the source of the slowness caused by authentication.

```py
import base64
from django.contrib.auth import authenticate, get_user_model
from django.http import HttpResponse
from rest_framework.authentication import BaseAuthentication
from rest_framework.decorators import api_view, authentication_classes

class CustomBasicAuthentication(BaseAuthentication):
    def authenticate(self, request):
        # Decode username and password from HTTP-header
        auth_header = request.META['HTTP_AUTHORIZATION'].split()
        auth = base64.b64decode(auth_header[1])
        uname, passwd = str(auth, 'utf-8').split(':')

        # Example 1: use authenticate method
        # authenticate is slow
        # user = authenticate(username=uname, password=passwd)
        # return (user, None)

        # Example 2: fetch user and explicitly check_password
        # fetching user is fast
        user = get_user_model().objects.filter(username=uname).first()
        # user.check_password is slow
        if user and user.check_password(passwd):
            return (user, None)

        return None

def hello_world(request):
    return HttpResponse({"message": "Hello world!"})


@api_view()
@authentication_classes([CustomBasicAuthentication])
def hello_world_drf(request):
    return HttpResponse({"message": "Hello world from DRF!"})
```

**Example 1**: uses `authenticate`-method and it is slow.

**Example 2**: fetches user from DB and executes `check_password`. `check_password`-method is slow.

[Django docs: django.contrib.auth.models.User.check_password](https://docs.djangoproject.com/en/4.1/ref/contrib/auth/#django.contrib.auth.models.User.check_password)

[GitHub: AbstractBaseUser.check_password](https://github.com/django/django/blob/292aacaf6c3d6956ca2c51c41e36dbf425389346/django/contrib/auth/base_user.py#L110)

### Profile with cProfile

Install `cprofile`-middleware.

```py
python -m pip install django-cprofile-middleware
```

Add to `settings.py`.

```py
DJANGO_CPROFILE_MIDDLEWARE_REQUIRE_STAFF = False

MIDDLEWARE = [
    ....
    "django_cprofile_middleware.middleware.ProfilerMiddleware",
]
```

Remove custom authentication from the endpoint.

```py
@api_view()
def hello_world_drf(request):
    return HttpResponse({"message": "Hello world from DRF!"})
```

Make request with `prof` query parameter to `http://127.0.0.1:8000/hello-drf/?prof`.

From the response we can see that `_hashlib.pbkdf2_hmac` takes 85ms.

```sh
<pre>         1682 function calls (1660 primitive calls) in 0.088 seconds

   Ordered by: internal time
   List reduced from 480 to 100 due to restriction <100>

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.085    0.085    0.085    0.085 {built-in method _hashlib.pbkdf2_hmac}
        2    0.000    0.000    0.000    0.000 {function SQLiteCursorWrapper.execute at 0x7feb68bdd550}
        1    0.000    0.000    0.000    0.000 {built-in method _sqlite3.connect}
        1    0.000    0.000    0.000    0.000 _functions.py:40(register)
        3    0.000    0.000    0.000    0.000 {method 'execute' of 'sqlite3.Connection' objects}
        1    0.000    0.000    0.000    0.000 compiler.py:1329(apply_converters)
...
```

Read more about `cprofile`-output: [https://medium.com/kami-people/profiling-in-django-9f4d403a394f](https://medium.com/kami-people/profiling-in-django-9f4d403a394f)

### Solution 3.1: Changing Password Hasher May Increase the Performance

[https://docs.djangoproject.com/en/4.1/topics/auth/passwords/](https://docs.djangoproject.com/en/4.1/topics/auth/passwords/)

[https://github.com/django-tastypie/django-tastypie/issues/371#issuecomment-5739426](https://github.com/django-tastypie/django-tastypie/issues/371#issuecomment-5739426)

### Solution 3.2: Cache Authenticated User

It is highly unlikely that authentication is required for every request. We can cache the authenticated user for a short period of time.

Create a custom `BasicAuthentication` with caching.

```py
class CachedBasicAuthentication(BasicAuthentication):
    def authenticate(self, request):
        auth_header = request.META["HTTP_AUTHORIZATION"]
        cache_key = f"auth:{auth_header}".replace(" ", "")
        cached_user = cache.get(cache_key)
        if cached_user:
            return cached_user

        result = super().authenticate(request)
        cache.set(cache_key, result, 900)  # 15minutes
        return result
```

Set it to `hello_world_drf`-function.

```py
@api_view()
@authentication_classes([CachedBasicAuthentication])
def hello_world_drf(request):
    return HttpResponse({"message": "Hello world from DRF!"})
```

Or set as default authentication class.

```py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'todo_api.authentication.CachedBasicAuthentication',
    ]
}
```

## Performance Using API Key

Performance with `API key` should be around same as with `BasicAuthentication`.

Follow instructions on how to add `API key` to `Django`-project from: [https://florimondmanca.github.io/djangorestframework-api-key/](https://florimondmanca.github.io/djangorestframework-api-key/)

Make sure admin-site is enabled from `urls.py`.

```py
from django.contrib import admin
...

urlpatterns = [
	path('admin/', admin.site.urls),
	...
]
```

Add permission and remove authentication from `settings.py`.

```py
REST_FRAMEWORK = {
    # 'DEFAULT_AUTHENTICATION_CLASSES': [
    #     'rest_framework.authentication.BasicAuthentication',
    # ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework_api_key.permissions.HasAPIKey",
    ]
}
```

Go to `http://127.0.0.1:8000/admin`, create new API key and copy the key from the prompt.

> The API key for drf-perf-test-key is: YxpSOq1c.vF1iFFpXDcPGY92qIXg3sQkfwvBmWa6g. Please store it somewhere safe: you will not be able to see it again.

Make new request with API key (replace `YxpSOq1c.vF1iFFpXDcPGY92qIXg3sQkfwvBmWa6g` with your API-key).

```sh
curl -H "Authorization: Api-Key YxpSOq1c.vF1iFFpXDcPGY92qIXg3sQkfwvBmWa6g" -w '\nTotal: %{time_total}s\n' http://127.0.0.1:8000/hello-drf/

Hello world from DRF!
Total: 0.097492s

curl -H "Authorization: Api-Key YxpSOq1c.vF1iFFpXDcPGY92qIXg3sQkfwvBmWa6g" -w '\nTotal: %{time_total}s\n' http://127.0.0.1:8000/hello/
Hello world!
Total: 0.005341s
```

Debug `has_permission` from permission-class and see how it works. File is in e.g.
`.venv/lib/python3.9/site-packages/rest_framework_api_key/permissions.py`.

Profiler shows similar results for API key as for Basic Authentication.

```sh
curl -H "Authorization: Api-Key YxpSOq1c.vF1iFFpXDcPGY92qIXg3sQkfwvBmWa6g" -w '\nTotal: %{time_total}s\n' http://127.0.0.1:8000/hello-drf/?prof
```

```sh
<pre>         1429 function calls (1402 primitive calls) in 0.146 seconds

   Ordered by: internal time
   List reduced from 449 to 100 due to restriction <100>

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
        1    0.089    0.089    0.089    0.089 {built-in method _hashlib.pbkdf2_hmac}
        1    0.002    0.002    0.002    0.002 base.py:62(__init__)
        2    0.001    0.001    0.002    0.001 {function SQLiteCursorWrapper.execute at 0x7fa73ce65160}
        1    0.001    0.001    0.001    0.001 {built-in method _sqlite3.connect}
        1    0.001    0.001    0.131    0.131 permissions.py:45(has_permission)
        1    0.001    0.001    0.005    0.005 utils.py:191(create_connection)
...
```

### Performance Using OAuth

TODO

https://django-oauth-toolkit.readthedocs.io/en/latest/index.html

### Links

- [https://github.com/encode/django-rest-framework#example](https://github.com/encode/django-rest-framework#example)
- [https://github.com/encode/django-rest-framework/issues/4327](https://github.com/encode/django-rest-framework/issues/4327)
