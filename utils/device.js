import os from 'os';
import { usb, getDeviceList, findByIds } from 'usb';

const IFACE_CLASS = {
    AUDIO: 0x01,
    HID: 0x03,
    PRINTER: 0x07,
    HUB: 0x09
};

class Device {
    constructor(vid, pid) {
        this.vid = vid;
        this.pid = pid;
        this.device = null;
    }

    static getPrinters() {
        return getDeviceList().filter(function (device) {
            try {
                return device.configDescriptor?.interfaces.filter(function (iface) {
                    return iface.filter(function (conf) {
                        return conf.bInterfaceClass === IFACE_CLASS.PRINTER;
                    }).length;
                }).length;
            } 
            catch (e) {
                console.warn(e)
                return false;
            }
        });
    }
    
    static getDevice(vid, pid) {
        return new Promise((resolve, reject) => {
            try {
                const device = findByIds(vid, pid);
                device.open();
                resolve(device);
            } 
            catch (err) {
                reject(err);
            }
        });
    }

    async setDevice() {
        this.device = await Device.getDevice(this.vid, this.pid);
    }

    open(callback) {
        let self = this, counter = 0, index = 0;

        this.device.open();

        this.device.interfaces.forEach((iface) => {
            (function (iface) {
                iface.setAltSetting(iface.altSetting, function () {
                    try {
                        // http://libusb.sourceforge.net/api-1.0/group__dev.html#gab14d11ed6eac7519bb94795659d2c971
                        // libusb_kernel_driver_active / libusb_attach_kernel_driver / libusb_detach_kernel_driver : "This functionality is not available on Windows."
                        if ("win32" !== os.platform()) {
                            if (iface.isKernelDriverActive()) {
                                try {
                                iface.detachKernelDriver();
                                } catch (e) {
                                console.error("[ERROR] Could not detatch kernel driver: %s", e)
                                }
                            }
                        }
                        iface.claim(); // must be called before using any endpoints of this interface.
                        iface.endpoints.filter(function (endpoint) {
                            if (endpoint.direction == 'out' && !self.endpoint) {
                                self.endpoint = endpoint;
                            }
                            if (endpoint.direction == 'in' && !self.deviceToPcEndpoint) {
                                self.deviceToPcEndpoint = endpoint;
                            }
                        });
                        if (self.endpoint) {
                            self.emit('connect', self.device);
                            callback && callback(null);
                        } 
                        else if (++counter === self.device.interfaces.length && !self.endpoint) {
                            callback && callback(new Error('Can not find endpoint from printer'));
                        }
                    } 
                    catch (err) {
                        // Try/Catch block to prevent process from exit due to uncaught exception.
                        // i.e LIBUSB_ERROR_ACCESS might be thrown by claim() if USB device is taken by another process
                        // example: MacOS Parallels
                        callback && callback(err);
                    }
                });
            })(iface);
        });
        return this;
    }
    read(callback) {
        this.deviceToPcEndpoint.transfer(64, (error, data) => {
            callback && callback(data);
        });
    }

      write(data, callback) {
        //this.emit('data', data);
        this.endpoint.transfer(data, callback);
        return this;
      }
      close(callback, timeout) {
        if (!this.device) callback && callback(null);
        try {
          this.device.close();
          usb.removeAllListeners('detach');
          callback && callback(null);
          //this.emit('close', this.device);
        }
        catch (err) {
          callback && callback(err);
        }
        return this;
      }
}

export default Device;