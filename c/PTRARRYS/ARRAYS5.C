/*  For strings, there is an option to do things a little differently.
    One option is to use an array of strings of a fixed length:
        char ary[numItems][maxLen];
    In this case, the allocated space will be:
        numItems * maxLen * sizeof( char );

    One drawback of this method is that you allocate the same amount of
    space for each string, so if some strings are shorter than others,
    you will be wasting some space.  This is actually true of any data 
    type, but it is normally with strings that you might have elements of 
    different lengths.  The ease of using such strings can overcome this 
    waste - particularly if the amount of waste is relatively small.

    Another option is to declare an array of pointers to type char.  With
    this technique, each element of the array holds a pointer which is then
    initialized to point to a block of memory which will hold the string.
    Usually that block of memory is obtained using dynamic allocation.

    The drawback of this method is the space used to hold the array of 
    pointers, and the overhead of each call to malloc.  For example, using 
    Turbo C++ 1.0 or Borland C++ 2.0 in the large memory model, each block 
    allocated with farmalloc requires a four-byte header, and all 
    allocations are rounded up to the nearest paragraph.  Thus, if you
    request an allocation of 40 bytes, adding 4 bytes equals 44, and 
    rounding up to the nearest paragraph results in an actual allocation of 
    48 bytes.
*/

#include <stdio.h>
#include <conio.h>
#include <string.h>
#include <alloc.h>

/* max length of a string */
#define maxLen 130

/*  since GetStrings will need to modify the actual value of our char**,
    we will have to pass the address of that variable, or char***.
*/
int GetStrings( char*** );
void ShowStrings( int, char** );

int main (void)
{
    char **strings;
    int numStrings;

    /* The first display of the stack is 4096 - 6 = 4090 */
    printf( "SP in function main: %u\n", _SP );

    numStrings = GetStrings( &strings );
    ShowStrings( numStrings, strings );
    return 0;
}

int GetStrings( char ***inStrings )
{
    int count, i;
    char bfr[40];

    /*  Stack pointer = 4090 - 6 (function overhead) - 4 (char ***) - 44
        (local variables) - 2 (preserve SI register) = 4034
        Note: that the generated code for this procedure will use the SI 
        register.  Thus, the compiler generates code to push SI on the 
        stack to preserve it, and then restores it at function end.
    */
    printf( "SP in function GetStrings: %u\n", _SP );

    cputs( "How many strings to enter? ");
    gets( bfr );
    sscanf( bfr, "%d", &count );

    /* allocate space for the array of pointers */
    /* note we now have to dereference the pointer */
    *inStrings = ( char** ) malloc ( count * sizeof( char* ) );

    /* and get the strings */
    cputs( "Enter strings.\r\n" );
    for( i=0; i<count; i++ )
    {
        cprintf("%3d: ", i);
        gets( bfr );
        /* note that strdup does dynamic allocation */
        (*inStrings)[i] = strdup( bfr );
    }
    return count;
}


void ShowStrings( int Size, char **outStrings )
{
    int i;
    /*  Stack pointer = 4090 - 6 (function overhead) - 6 (formal 
        parameters) - 2 (local variables) = 4076
    */
    printf( "SP in function ShowStrings: %u\n", _SP );

    for( i=0; i<Size; i++ )
    {
        cputs( outStrings[i] );
        cputs( "\r\n" );
    }
}
