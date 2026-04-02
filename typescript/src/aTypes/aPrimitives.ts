/*
	string
	number
	boolean
	null            A deliberate absence of any object value. When something could intentionally be empty, not just missing.
        "strictNullChecks": true
        let name: string | null = null;
        name.toUpperCase(); // ❌ Error: object is possibly null

        name?.toUpperCase(); // ✅ safe

	undefined       something should have a value but doesn't yet. You use undefined to mean “value not found / not provided”
	any				disables all type checking
	unknown			safer than any. Must check the type before using it
	void            Indicates that a function does not return a value.
	never			Represents a value that never occurs — e.g., functions that always throw or never return.
*/
