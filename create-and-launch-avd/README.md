## [create-and-launch-avd](https://github.com/shapehq/actions/tree/main/create-and-launch-avd/action.yml)

Creates and launches an Android Virtual Device.
Note: This action must run on a GitHub runner that supports [KVM](https://linux-kvm.org/).

The action has the following inputs:
|Name|Default|Description|
|-|-|-|
|`avdName`|ci_avd|The name of the created AVD.|
|`apiLevel`|35|Android version of the system image that the AVD will run.|

Example:

```yml
- name: Create and launch AVD
  uses: shapehq/actions/create-and-launch-avd@main
  with:
    avdName: my_avd
    apiLevel: 34
- name: Run instrumentation tests
  run: ./gradlew connectedAndroidTest
```
