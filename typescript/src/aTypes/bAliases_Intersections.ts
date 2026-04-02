// intersection types
type Timestamped = { createdAt: Date };
type UserWithTimestamp = User & Timestamped;

interface Skier {
    slide(): void;
    squoink(): void;
}



// 1. Implementing the Interface in a Class
class AlpineSkier implements Skier {
    slide(): void {
        console.log("Sliding downhill");
    }

    squoink(): void {
        console.log('AlpineSkier squoink');
    }
}
const skier = new AlpineSkier();
skier.slide();



// 2. Using the Interface as a Type for an Object. Structural typing: the object matches the shape. No class required
const skier2: Skier = {
  slide() {
    console.log("Sliding on snow");
  },
    squoink(): void {
        console.log('skier2 squoink');
    }
};



// 3. Using the Interface as a Function Parameter
function startRun(skier: Skier) {
  skier.slide();
}


interface Shooter {
    shoot(): void;
    squoink(): void;
}


/*
Union: 
    type A = X | Y;
    Can only use elements comon to both interfaces
*/
type myUnion = Skier | Shooter;

let x: myUnion = {
    slide(): void {
        console.log('myUnion sliding');
    },
    shoot(): void {
        console.log('myUnion shooting');
    },
    squoink(): void {
        console.log('myUnion squoinking');
    }
};
// x.slide();  fails
// x.shoot();  fails
x.squoink();


/* 
Intersection:
    type A = X & Y;
    A value must satisfy all combined types at the same time
*/
type myIntersection = Skier & Shooter;

let y: myIntersection = {
    slide(): void {
        console.log('myIntersection sliding');
    },
    shoot(): void {
        console.log('myIntersection shooting');
    },
    squoink(): void {
        console.log('myIntersection squoinking');
    }
};
y.shoot();
y.slide();
y.squoink();


// Define the Interfaces (Variants)
interface IdleRequest {
  status: "idle";               // discriminant property
}

interface LoadingRequest {
  status: "loading";
}

interface SuccessRequest {
  status: "success";
  data: string;
}

interface ErrorRequest {
  status: "error";
  message: string;
}

// Create the Discriminated Union
type Request = IdleRequest | LoadingRequest | SuccessRequest | ErrorRequest;

// Create Values
// Explicitly declares its variant via status. Is required to satisfy only that interface
const r1: Request = { status: "idle" };

const r2: Request = {
  status: "success",
  data: "Hello world"
};

const r3: Request = {
  status: "error",
  message: "Timeout"
};

// Use the Discriminant to Narrow
function handleRequest(req: Request) {
  switch (req.status) {
    case "idle":
      console.log("Nothing happening yet");
      break;

    case "loading":
      console.log("Loading...");
      break;

    case "success":
      console.log(req.data); // ✅ SuccessRequest
      break;

    case "error":
      console.error(req.message); // ✅ ErrorRequest
      break;

    default:
      const _exhaustive: never = req;
      throw new Error("Unhandled request state");
  }
}




