// types/bluetooth.d.ts - Web Bluetooth API type declarations

declare global {
    interface Navigator {
      bluetooth: Bluetooth;
    }
  
    interface Bluetooth {
      requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
      getAvailability(): Promise<boolean>;
      addEventListener(type: string, listener: EventListener): void;
      removeEventListener(type: string, listener: EventListener): void;
    }
  
    interface RequestDeviceOptions {
      filters?: BluetoothLEScanFilter[];
      optionalServices?: BluetoothServiceUUID[];
      acceptAllDevices?: boolean;
    }
  
    interface BluetoothLEScanFilter {
      services?: BluetoothServiceUUID[];
      name?: string;
      namePrefix?: string;
      manufacturerData?: Record<number, DataView>;
      serviceData?: Record<BluetoothServiceUUID, DataView>;
    }
  
    interface BluetoothDevice extends EventTarget {
      readonly id: string;
      readonly name?: string;
      readonly gatt?: BluetoothRemoteGATTServer;
      watchAdvertisements(): Promise<void>;
      unwatchAdvertisements(): void;
      addEventListener(type: 'gattserverdisconnected', listener: (event: Event) => void): void;
    }
  
    interface BluetoothRemoteGATTServer {
      readonly device: BluetoothDevice;
      readonly connected: boolean;
      connect(): Promise<BluetoothRemoteGATTServer>;
      disconnect(): void;
      getPrimaryService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
      getPrimaryServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]>;
    }
  
    interface BluetoothRemoteGATTService extends EventTarget {
      readonly device: BluetoothDevice;
      readonly uuid: string;
      readonly isPrimary: boolean;
      getCharacteristic(characteristic: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic>;
      getCharacteristics(characteristic?: BluetoothCharacteristicUUID): Promise<BluetoothRemoteGATTCharacteristic[]>;
      getIncludedService(service: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService>;
      getIncludedServices(service?: BluetoothServiceUUID): Promise<BluetoothRemoteGATTService[]>;
    }
  
    interface BluetoothRemoteGATTCharacteristic extends EventTarget {
      readonly service: BluetoothRemoteGATTService;
      readonly uuid: string;
      readonly properties: BluetoothCharacteristicProperties;
      readonly value?: DataView;
      readValue(): Promise<DataView>;
      writeValue(value: BufferSource): Promise<void>;
      writeValueWithoutResponse(value: BufferSource): Promise<void>;
      writeValueWithResponse(value: BufferSource): Promise<void>;
      startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
      stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
      addEventListener(type: 'characteristicvaluechanged', listener: (event: Event) => void): void;
    }
  
    interface BluetoothCharacteristicProperties {
      readonly broadcast: boolean;
      readonly read: boolean;
      readonly writeWithoutResponse: boolean;
      readonly write: boolean;
      readonly notify: boolean;
      readonly indicate: boolean;
      readonly authenticatedSignedWrites: boolean;
      readonly reliableWrite: boolean;
      readonly writableAuxiliaries: boolean;
    }
  
    type BluetoothServiceUUID = number | string;
    type BluetoothCharacteristicUUID = number | string;
  }
  
  export {};
  