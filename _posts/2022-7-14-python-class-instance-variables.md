---
layout: post
title: Python class and instance variables
excerpt: Understanding Python class (static) and instance variables through examples with and without type annotations.
---

- Class variables are shared by all instances of the class
  - Class variable's are declared outside of any instance methods
- Instance variables are owned by each instance

Good rule on decididing when to use class or instance variables:
- Always use instance variables, unless there is a specific need to share data between instances.
- With type annotations is good to use value-less annotions to declare instance variables

It is easy to make mistakes if instance and class variables are used in a same class.

```py
class QueryClient:
    source = "www.google.com"  # class variable

    def __init__(self, id):
        self.id = id  # instance variable
        print(f"Init client {self.id} for: {self.source}") # self.source is a class variable

    def fetch(self, query):
        result = f"Fetching: {self.source} with query {query}"
        print(result)
        return result

    def change_source(self, new_source):
        self.source = new_source  # note: this makes self.source an instance variable
        print(f"Client {self.id} source changed to: {self.source}")

"""
1. create a new instance of the class
2. change class variable source
3. create 2nd instance
4. change 2nd instance source
5. change class variable source
"""

query = "python instance vs class variables"

# default class variable is www.google.com
print(QueryClient.source)

client_one = QueryClient(1)
client_one.fetch(query)  # www.google.com

# change the class variable
QueryClient.source = "www.yahoo.com"

client_one.fetch(query) # www.yahoo.com

# Create 2nd instance
client_two = QueryClient(2)
client_two.fetch(query) # www.yahoo.com

client_two.change_source("www.bing.com")
print(QueryClient.source)  # production.company.com

# change_url changed url to an instance variable
client_two.fetch(query) # www.bing.com
# client_one's url is still a class variable
client_one.fetch(query)  # www.yahoo.com

QueryClient.url = "www.duckduckgo.com"

client_one.fetch(query)  # www.duckduckgo.com
# 2nd instances url didn't change as it is now a class variable
client_two.fetch(query) # www.bing.com
```

Type annotations change the behaviour a little: [pep-05269](https://peps.python.org/pep-0526/#class-and-instance-variable-annotations)

> Type annotations can also be used to annotate class and instance variables in class bodies and methods. In particular, the value-less notation a: int allows one to annotate instance variables that should be initialized in __init__ or __new__. The proposed syntax is as follows:

Example from [pep-05269](https://peps.python.org/pep-0526/#class-and-instance-variable-annotations):
```py
from typing import ClassVar


class Starship:
    captain: str = "Picard"               # instance variable with default 
    damage: int                           # instance variable without default
    stats: ClassVar[dict[str, int]] = {}  # class variable

    def __init__(self, damage: int, captain: str | None = None):
        self.damage = damage
        if captain:
            self.captain = captain  # Else keep the default

    def hit(self) -> None:
        Starship.stats['hits'] = Starship.stats.get('hits', 0) + 1


# Note:
# captain is actually a class variable
# damage is an instance variable
enterprise_d = Starship(3000)
enterprise_d.hit()

enterprise_d.stats = {}  # Flagged as error by a type checker 
# (NOTE: This makes enterprise_d.stas an instance variable)
Starship.stats = {}  # This is OK

Starship.captain = "Kirk"  # This is also OK as captain is actually a class variable
print(enterprise_d.captain)  # captain is "Kirk"

enterprise_d.captain = "Sisko"

print(Starship.captain)  # captain is "Kirk"
print(enterprise_d.captain)  # captain in "Sisko"
```

Other way to define instance variable with default value:
```py
class Starship:
    captain: str 

    def __init__(self, captain: str = "picard"):
        self.captain = captain 
```

[Data Classes](https://docs.python.org/3/library/dataclasses.html) use type annotations to annotate instance variables. `__init__` is generated automatically with instance variable arguments. 

```py
from dataclasses import dataclass

@dataclass
class Person:
    name: str
    age: int = 20


p = Person("Timmy")
print(p.name)
print(p.age)

# With dataclasses it is also possible to use class variables
Person.name = "Hello"
Person.age = 99

print(Person.name)
print(Person.age)

# But it won't affect default values set in the class definition
p2 = Person("Timmy 2nd")

print(p2.name)
print(p2.age)
```

Good Python Class Variables [example](https://pynative.com/python-class-variables/).
