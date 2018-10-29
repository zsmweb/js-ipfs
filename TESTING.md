# Testing js-ipfs
The following covers the targeted design of the test suite to provide clearer guidance for js-ipfs developers on what to test and where to test it.

## Parts of js-ipfs
js-ipfs is composed of two primary parts; core and http. `core` holds the fundamental workings of js-ipfs. All code paths ultimately lead to core, and as such testing it should be the highest priority. `http` exposes an api to allow external code to execute the core functionality without running the code directly, such as with the cli daemon.

js-ipfs also has a secondary part, the `cli`. The cli is a thin wrapper around the primary components which allows users to interact with an ipfs node via a command line interface.

## Testing the parts

### Core
Core is where the majority of tests should be focused for js-ipfs. It's important to clearly test the inputs and outputs to each core component, so that tests for `http` and `cli` can focus on the validation of their interfaces. This avoids the redundant testing that can easily occur if each part of js-ipfs is tested end to end. This also makes debugging significantly easier, as the code paths under test are reduced.

### HTTP
HTTP is an api layer on top of `core`. Tests for it should focus on ensuring the api is transforming requests properly, by mocking the core interface and verifying that the correct data is sent. The tests should also ensure that mocked data and errors returned by the mocked core are properly transformed in the response from the api. This validates that the `http` interface is well tested, without duplicating the tests in `core.`

### Cli
The Cli is a lightweight wrapper that leverages `core`, `http`, or `ipfs-api`, depending on the commands, to provide command line usage of js-ipfs. Tests for it should focus on validating that commands and arguments are being properly converted into the appropriate js-ipfs call. The cli entry point (bin.js) should be validated for its various use cases, this is where 100% code coverage is highly useful. However, testing bin.js for each command is unnecessary. Instead, the handlers themselves should be tested directly while mocking the underlying js-ipfs component. Since `core` ultimately handles the logic, we just need to ensure the correct data is being passed inside the handler, and that the responses are being rendered properly by `cli`.

An important thing to note for `cli` is that it leverages `ipfs-api` to call out to the js-ipfs daemon, which runs the `http` api. Tests should not validate `ipfs-api` logic, as it should have its own test suite. As such, we can stick to mocking out the call to it in the cli handlers.
