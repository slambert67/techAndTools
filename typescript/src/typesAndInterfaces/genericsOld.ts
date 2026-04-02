// generic functions

function pair<T,U>(first: T, second: U): [T, U] {
    return [first, second];
}

const myPair = pair('hello', 42);   // type is [string, number]
console.log(myPair);                // ['hello', 42]

const myPair2 = pair(42, 'hello');  // type is [number, string]
console.log(myPair2);               // [42, 'hello']


// make immutable and validated
/*
export class CustomerId {
  private constructor(private readonly customerIdValue: number) {}

  // Factory method for controlled creation
  static create(value: number): CustomerId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error(`Invalid customer ID: ${value}`);
    }
    return new CustomerId(value);
  }

  // Getter — expose value safely
  get value(): number {
    return this.customerIdValue;
  }
}

The constructor is private, so no one can do new CustomerId(0) directly.
The only way to create one is through CustomerId.create(…), which validates input.
The internal value is readonly, so it can’t be changed later.

const id1 = CustomerId.create(42);
console.log(id1.value); // 42

*/

// generic interfaces
class CustomerId {

    constructor(private customerIdValue: number) {

    }

    // getter - special type of function
    // allows accessing a property by name even though it's computed by a function
    // e.g. instance.value
    get value() {
        return this.customerIdValue;
    }
}

class Customer {
    constructor(public id: CustomerId, public name: string) {     
    }
}


interface Repository<T, TId> {
    getById(id: TId): T;
    persist(model: T): TId;
}


class CustomerRepository implements Repository<Customer, CustomerId> {
    constructor( private customers: Customer[] ) {
    };

    getById(id: CustomerId) {
        return this.customers[id.value];
    }

    persist(customer: Customer) {
        this.customers[customer.id.value] = customer;
        return customer.id;
    }
}


// generic classes
class DomainId<T> {
  constructor(private id: T) {}

  get value(): T {
    return this.id;
  }
}


class OrderId extends DomainId<number> {
  constructor(orderIdValue: number) {
    super(orderIdValue);
  }
}


class AccountId extends DomainId<string>{
  constructor(accoundIdValue: string) {
    super(accoundIdValue);
  }
}

// examples of compatibility

function onlyAcceptsOrderId(orderId: OrderId) {
}


function onlyAcceptsDomainId(id: DomainId<any>) {
}

function onlyAcceptsDomainId2(id: DomainId<OrderId | AccountId>) {
}

const accountId = new AccountId('GUID-1');
const orderId = new OrderId(5);

// onlyAcceptsOrderId(accountId); Error: AccountId is not assignable to OrderId