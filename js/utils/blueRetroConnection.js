import { brUuid } from './constants.js';

export function getBlueRetroDevice(previousDevice = null) {
    if (previousDevice) {
        return Promise.resolve(previousDevice);
    }

    return navigator.bluetooth.requestDevice({
        filters: [{namePrefix: 'BlueRetro'}],
        optionalServices: [brUuid[0]],
    });
}

export function connectFromAppShell(connect) {
    if (window.parent === window || !window.parent.blueRetroConnection) {
        return;
    }

    document.documentElement.classList.add('embedded-tool');

    const connectionRequired = Array.from(document.querySelectorAll('[data-connection-required]'));
    const unavailableNotice = document.createElement('div');
    unavailableNotice.className = 'tool-unavailable notice';
    unavailableNotice.setAttribute('role', 'status');
    unavailableNotice.innerHTML = '<strong>Adapter connection required.</strong> These options are available after BlueRetro connects.';
    if (connectionRequired.length) {
        connectionRequired[0].before(unavailableNotice);
    }

    const setAvailability = connected => {
        document.documentElement.classList.toggle('adapter-unavailable', !connected);
        unavailableNotice.hidden = connected;
        connectionRequired.forEach(element => {
            element.inert = !connected;
            element.setAttribute('aria-disabled', connected ? 'false' : 'true');
        });
        document.querySelectorAll('[data-preview-only]').forEach(element => {
            element.hidden = connected;
        });
    };

    setAvailability(false);

    const reportHeight = () => {
        window.parent.postMessage({
            type: 'blueretro-tool-height',
            height: document.documentElement.scrollHeight,
        }, window.location.origin);
    };

    new ResizeObserver(reportHeight).observe(document.body);
    reportHeight();

    const loading = document.createElement('div');
    loading.id = 'toolLoadingState';
    loading.className = 'loading-state';
    loading.setAttribute('role', 'status');
    loading.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Loading adapter settings…</span>';
    loading.hidden = true;
    document.body.insertBefore(loading, document.body.firstChild);

    const connectToShellDevice = () => {
        const device = window.parent.blueRetroConnection.getDevice();
        if (device && device.gatt.connected) {
            loading.hidden = false;
            Promise.resolve(connect(device)).then(() => {
                setAvailability(true);
            }).finally(() => {
                loading.hidden = true;
                reportHeight();
            });
        }
    };

    window.addEventListener('message', event => {
        if (event.origin === window.location.origin
          && event.data
          && event.data.type === 'blueretro-connected') {
            connectToShellDevice();
        }
        else if (event.origin === window.location.origin
          && event.data
          && (event.data.type === 'blueretro-disconnected'
            || event.data.type === 'blueretro-forgotten')) {
            setAvailability(false);
            reportHeight();
        }
    });

    connectToShellDevice();
}
