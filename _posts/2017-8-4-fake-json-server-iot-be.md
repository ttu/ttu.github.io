---
layout: post
title: Fake JSON Server as an IoT Back End
---

How to use Fake JSON Server as an IoT Back End.

Setup:
```
RuuviTag Sensor <- Raspberry PI -> PC with Fake JSON Server
```

<img src="https://lh3.googleusercontent.com/6aHT-7EnYG1-tfOvH2Gavoq0YZTjotfOzO76fuWBv1uEbRVQvHqQqmtpk-My-iqTCRoCKv_KoqXCt_ptijqZ_NYpTiGf34ubJOAwhFu-9DDFlIFa9jZcGeH2pviRK0wsNaP3C_E_3raG1xeQQjlCgP4SJRRs1z2ssBgaLJEjJkpxsMMzgqQFmwayAYwJjhwiWNjxZsJhjaTHrIdq7n-RSxI-5q5XwHL4onK55WvaO7xz-06pAiHWn6X6dpWa-SrwTLRzEwFFaTJVu9QITD7KuoDWngoCCNd4wPFO1xOAviNeCO2iWFUEOu-nXc4I9uIZt0JzFMgjEPSN7QA84qWi3Z6_juMUzPn2EPwu4yEr07__3ffCRVRxSukQJIxnugFGifgOYiQDrxhLIsoZIMFMe-Dn44FK3u7UZLLtftYv9-KO62AF0KpW4YsOyMvWz9n06PaCLp13LPkqkdnghq0NgfXd9xVmoNPFXc1B8um7XVZHEyQ4ZoI3DKcLJYTWuhTfAI2aj56L9t8ToVagukOSZkTRHNerEwuWmOOaZuzrgEC7uyUtYOSZISc0c619bFiJRAKD9tUxmGT7O7bhLfGlYMDEGqXmglvpilYKJEdTAy82V2lhgKdUHkWzOIXlW43DmM7KjQg-gDBhpfSp3-nj9Hn--mQknjvVjuR9C_boTfs=w1218-h685-no" />

Raspberry Pi is scanning RuuviTag sensors and when the updated data for the sensor is found, it sends new data to Fake JSON Server.

## Running the setup

#### Start Fake JSON Server


1. Clone the repository
```sh
$ git clone https://github.com/ttu/dotnet-fake-json-server.git
$ cd dotnet-fake-json-server/FakeServer
```
2. Copy [sensors.html](https://gist.github.com/ttu/427d817742ccea339d7c9cd8833a87ce) from Gist to `/wwwroot` folder
3. Edit appsettings.json
  * Set `Common.EagerDataReload` to _false_
  * Set `Api.UpsertOnPut` to _true_
4. Start the server
```sh
$ dotnet run --file iot.json --urls http://0.0.0.0:57602
```
5. Open [http://localhost:57602/sensors.html](http://localhost:57602/sensors.html)

#### Install RuuviTag package to Raspberry Pi (Raspbian) or to PC with Linux

RuuviTag Python package [Installation Guide](https://github.com/ttu/ruuvitag-sensor#installation)

#### Execute Python script

IP address of PC with Fake JSON Server is _192.168.2.22_.

```python
from datetime import datetime
from urllib.parse import quote
import requests
from ruuvitag_sensor.ruuvi import RuuviTagSensor

all_data = {}
url = 'http://192.168.2.22:57602/api'

def handle_data(new_data):
    sensor_mac = new_data[0]
    sensor_data = new_data[1]

    if sensor_mac not in all_data or all_data[sensor_mac]['data'] != sensor_data:
        # sensordatas POST will overwrite id, but sensors PUT will use it
        update_data = {'id': sensor_mac, 'mac': sensor_mac, 'data': sensor_data, 'timestamp': datetime.now().isoformat()}
        all_data[sensor_mac] = update_data
        requests.put('{url}/sensors/{mac}'.format(url=url, mac=quote(sensor_mac)), json=update_data)
        requests.post('{url}/sensordatas'.format(url=url), json=update_data)

RuuviTagSensor.get_datas(handle_data)
```

Async version of the script can be found from [ruuvitag-sensor/examples](https://github.com/ttu/ruuvitag-sensor/blob/master/examples/send_updated_async.py). 

Script sends data to 2 different endpoints:

```
POST /api/sensordatas    : sensordatas has all sent datas
PUT  /api/sensors/{mac}  : sensors has latest data for each sensor
```

#### Saved data

Data in `iot.json`. Sensors have different fields depending on the sensor's firmware.

```json
{
  "sensors": [
    {
      "id": "F4:A5:74:89:16:57",
      "mac": "F4:A5:74:89:16:57",
      "data": {
        "humidity": 46.5,
        "temperature": 24.36,
        "pressure": 998.55,
        "acceleration": 1038.0433516958722,
        "acceleration_x": 78,
        "acceleration_y": -15,
        "acceleration_z": 1035,
        "battery": 2893
      },
      "timestamp": "2017-07-01T18:36:56.547306"
    },
    {
      "id": "CA:F7:44:DE:EB:E1",
      "mac": "CA:F7:44:DE:EB:E1",
      "data": {
        "temperature": 24.0,
        "humidity": 38.0,
        "pressure": 998.0,
        "identifier": null
      },
      "timestamp": "2017-07-01T18:36:57.229115"
    }
  ],
  "sensordatas": [
    {
      "id": 0,
      "mac": "F4:A5:74:89:16:57",
      "data": {
        "humidity": 46.5,
        "temperature": 24.35,
        "pressure": 998.48,
        "acceleration": 1030.2921915650918,
        "acceleration_x": 82,
        "acceleration_y": -7,
        "acceleration_z": 1027,
        "battery": 2887
      },
      "timestamp": "2017-07-01T18:36:56.044941"
    },
    {
      "id": 1,
      "mac": "F4:A5:74:89:16:57",
      "data": {
        "humidity": 46.5,
        "temperature": 24.36,
        "pressure": 998.55,
        "acceleration": 1038.0433516958722,
        "acceleration_x": 78,
        "acceleration_y": -15,
        "acceleration_z": 1035,
        "battery": 2893
      },
      "timestamp": "2017-07-01T18:36:56.547306"
    },
    {
      "id": 2,
      "mac": "CA:F7:44:DE:EB:E1",
      "data": {
        "temperature": 24.0,
        "humidity": 38.0,
        "pressure": 998.0,
        "identifier": null
      },
      "timestamp": "2017-07-01T18:36:57.229115"
    }
  ]
}
```

### Sensors HTML page

HTML page has a component for each sensor:

<img src="https://lh3.googleusercontent.com/YyiVGcxikooLsrOA7gAjVrzD7T5TJh9aF-obmPDHixPsxd9fqxxlSWm_TiBWBGprPjYyTfBOU9rjHMOIhswNOcDLhmqTcgUoT-2gslTWm7ZeBqb53Ioxc59eH00WitHnPEPr6IqeDlAo0sH1oIYwu_eojvvmAMrLxx43sqaDKjxs4CzMfUiFvEv6TtUG3l9GkgtfhmxkF0V2omhO3healOVrNcMqvcklkZeWPrCVWZHrJ3I4TmDvLNDL9kWuyVW4HbhDgwnomwLfh3KrBjE4hoT_lWS1sqmYBvv0pWy552FujiaTEqAYco1Nnlu-NulENb9kM40iGkcTFj8jJvCjAXi2D52voeyOvgsRHSZE4NPExbfpoKXvlckyu_5Kd1-aEBX3nID7Wbb5-T8uaj2GWmoytdsqtCEq_sTLQYWnNveOdnEHqBAqQUaBTwfw81skSbgkbzFrG7Onpb68SyUWsdTu4pfJPYknASrsoR-9-zB0JrHGzDn0kUsoCazZk0xwqO8oVptGXN2R2MPpaSaVkLdf7oVgMW31BHXurSetTLuKIsYWmEzLML07O6R2tw3FQhuTu8OzJTOErG4q2_lgFa8A_ntDTFBpg7NhPYfBUSNlLMs6wFjuDBG-8J9OszWQyePAVdw0_Khn1gk6UK77-6axORtIm0KhtpHuAw50ELU=w498-h519-no" width="300px" />

Every time a new data is sent to the back end, the page gets a notification with a websocket and the data for that sensor is updated with a new request.

### Q & A

Q: Why Fake JSON Server is not running on Raspberry Pi?<br/>
A: At the moment .NET Core and ARM setup requires some manual work and I'm currently too lazy to do that.
<br/><br/>
Q: Why wouldn't I just use Redis, InfluxDB or some othe database?<br/>
A: All of those are better options that this.