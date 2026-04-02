// 0 based
enum VehicleType {
    PedalCycle,
    MotorCycle,
    Car,
    Van,
    Bus,
    Lorry
}
const vehicle: VehicleType = VehicleType.Lorry;  // compiles to const vehicleType = 5
console.log(vehicle);           // 5
console.log(VehicleType[5]);    // Lorry - reverse mapping. Doesn't work with string enums below


// can specify values
enum CatType {
    Tiger = 10,
    Lion = 20,
    Leopard = 30
}

const cat = CatType.Tiger;
console.log(cat);  // 10

// string enums more common
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}


// compile time optimization - const enum
// This eliminates the enum object at runtime — good for high-performance or browser code.
const enum Direction2 {
  Up,
  Down,
  Left,
  Right
}


// You can use enums as keys or map them to data easily:
enum Permission {
  Read = "READ",
  Write = "WRITE",
  Execute = "EXECUTE"
}
const permissionLabels: Record<Permission, string> = {
  [Permission.Read]: "Can read files",
  [Permission.Write]: "Can modify files",
  [Permission.Execute]: "Can run files"
};

console.log(permissionLabels[Permission.Write]); // "Can modify files"




