---
layout: post
title: Philips Hue Outdoors Use
excerpt: Outdoors test of Philips Hue White bulbs at South Finland
---

Outdoors test of Philips Hue White bulbs at South Finland.

__Location:__ South Finland

__Installation date:__ 07/2016

__Model:__ 7 Philips Hue White E27

__Weather history:__ from 08/2016 to 06/2020 (provided by _wunderground.com_)

<img src="https://www.wunderground.com/cgi-bin/histGraphAll?day=1&year=2016&month=8&dayend=30&yearend=2020&monthend=6&ID=EFHK&type=6&width=614" />

__First failed bulp:__ 06/2020

---

3 bulbs were installed 23.7.2016 and 4 bulbs 31.7.2016. Only 1 bulb was in a sealed lamp and that one didn't work out so well as it started to get some humidity inside it from 10/2016. That bulb died 08/2017. Out of original 7 bulbs, first one to break without any external factors/humidity was at 06/2020.

<img src="https://lh3.googleusercontent.com/VZLj4PPIIycd6OdS3LCcy5KHNXzQP6B0YLh-Bt_1Jfg-9APIrJs1wH-KR34WzvHFWlOQu3_OcRt0QM6FgJ6WA7SxkNd3Tx3m1kLhqPrG-rncRN444c4dfNacSvo-LznQBNybtGvCuiuffZ2Q0r3WElTtnN_Utff-g8pNBdpaySzrCG3OO1U9OvIq8SmER8w2LfvvD4WDZy8KgtmT-_Z2V9jHCGT4YtDHX8zT3Aw-2fr6llIVt9n6yoM6Wu_6rjKp9vgEZcq4q_xEOGfxX66aUMG5DulezsFkqWmsyQyBVMEwKgnI-jmnxMDlf_ekUgZfIwdyvYxkDK8SqfxYAatuS2zbrdesvpfCmzx33_953wlP0LtjY_XVcsxgglZhbS8eFdfJcjMDLU36OwXhOthienxeqiq_Ur6pD6rsKYsu6QPspqtp6470S_E-td5ZPGW5bSQ-j1eshTVZNz9Lg6KGWrvBcvBtZqIsxGtYAczOz01rxgQXs4f0kb9XjMPm5e92YrIFsKpUegpuJfX7f4TxkDCKdCBU2P7p5VbJ2VCxpYE4IK-cyL-ig2vk9QPUoCIYrE6o8SqjY7fTyxfe2CQlIsmdFeV1quVSU_ye5PeEHyhTG90rUnw6q861CWADsEWeePqZeNQzgHr6YPJeywq_PcBgJ_pSxNVdxJw-qACthJA=s1024-no" width="500px" />

Lights were automatized with [IFTTT](https://ifttt.com). Lights turn on at sunset and turn off at sunrise. IFTTT fetches sunset and sunrise times from _weather.com_. On darkest time lights are on 18 hours and on lightest time 5 hours in a day ([Sun Graph for Helsinki](https://www.timeanddate.com/sun/finland/helsinki)).

(__07/2017__) There has been ~3 days when lights didn't turn on automatically when IFTTT was updating Hue integration and maybe 5 times when lights didn't turn on or off for unknown reason (problems with wifi etc.). Based on my experiences IFTTT's reliability is pretty good.

(__08/2017__) The bulb that was in a sealed lamp which had gathered humidity for since 10/2016 finally malfunctioned. Sealed case had like 50ml of water inside and lots of moisture. Considering that, I would say that Hue bulbs work well in moist conditions.

(__09/2017__) New bulb was installed in a new sealed lamp which has a proper IP rating for outdoors.

(__02/2018__) Lights are automated with Home Assistant instead of IFTTT. Uses Home Assistant's [Sun component](https://home-assistant.io/components/sun/).

(__02/2019__) Lights are automated with Philips Hue's own software as timing functionality is now much better.

(__09/2019__) New sealed lamp with proper IP rating failed and bulp broke because of humidity.

(__06/2020__) First bulp from the original batch to break without any external factors. End of test.