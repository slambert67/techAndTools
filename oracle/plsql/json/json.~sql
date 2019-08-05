drop table json_examples;

create table json_examples(
thejson varchar2(4000) constraint ensure_json1 check (thejson is json));

delete from json_examples;

insert into json_examples  values ('{ "name"   : "Alexis Bull",
                             "Address": { "street"  : "200 Sporting Green",
                                          "city"    : "South San Francisco",
                                          "state"   : "CA",
                                          "zipCode" : 99236,
                                          "country" : "United States of America" },
                             "Phone" : [ { "type" : "Office", "number" : "909-555-7307" },
                                         { "type" : "Mobile", "number" : "415-555-1234" } ] }');


-- dot notation
select je.thejson.name from json_examples je;
select je.thejson.Address.street from json_examples je;
select je.thejson.Phone[0].type from json_examples je;

-- json objects
declare
  myjson varchar2(4000);
  jo JSON_OBJECT_T;
  myname varchar2(30);

  address JSON_OBJECT_T;
  mycountry varchar2(40);

  phones JSON_ARRAY_T;
  phone JSON_ELEMENT_T;
  phoneObj JSON_OBJECT_T;
  myphone varchar2(20);

begin

  select thejson
    into myjson
    from json_examples;

  jo := JSON_OBJECT_T.parse(myjson);

  -- get scalar
  myname := jo.get_String('name');
  dbms_output.put_line('name = ' || myname);

  -- get object
  address := jo.get_Object('Address');
  mycountry := address.get_String('country');
  dbms_output.put_line('country = ' || mycountry);

  -- get array
  phones := jo.get_Array('Phone');
  --phone := phones.get(0);
  phone := phones.get(0);
  -- cast
  phoneObj := treat(phone as JSON_OBJECT_T);
  myphone := phoneObj.get_String('number');
  dbms_output.put_line('my phone number = ' || myphone);


exception
  when others then
    dbms_output.put_line('others: ' || sqlerrm);
end;
