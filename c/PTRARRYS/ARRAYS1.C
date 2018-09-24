/*  The comments in the program assume compiling in the large memory model 
    where pointers default to far and are 4 bytes each.
*/

/*  This is an example of passing a two dimensional array of pointers.  
    Although it would seem that we are passing the array by value, and it 
    is taking up 50 bytes on the stack, that is not the case.  The compiler 
    doesn't actually allow you to pass an array by value - behind the 
    scenes, it passes just a pointer to the array.  One thing important 
    about this is that if you modify the structure in a function to which 
    you pass the array, then the parent copy of the array actually gets 
    modified.  This program will demonstrate that.  If you have a situation 
    where this operation is a problem, you can force the array to be passed 
    by value by putting the array in a structure and then passing the 
    structure, as structues are passed by value.  Otherwise, if you need a
    local copy of the structure, (so you can modify the structure without 
    modifying the parent copy) you could make a copy in the function and
    operate on that copy (ie using memcpy).
*/

#include <conio.h>

void foo( int[5][10] );

int main(void)
{
    /*  Note that the dimensions used must be constant. */
    int iAry[5][10];
    int i, j;

    /* initialize the array so we have information to display */
    for( i=0; i<5; i++ )
        for( j=0; j<10; j++ )
            iAry[i][j] = i * sizeof( iAry[0] ) + j * sizeof( iAry[0][0] );

    /*  note that the size of this array will be 5 * 10 * 2 = 100 bytes.  
        We also declare two int variables, so our current stack usage is 
        100 + 2 * 2 = 104 bytes.  If you compile this in the large memory 
        model, the stack pointer starts out at 4096 and decrements as you 
        add to the stack, and increments as you pop things off the stack.  
        In our example, the beginning SP will be 4096 - 104 = 3992;
    */
    
    /* show where the stack pointer is before calling the function */
    cprintf( "SP in main = %u\r\n", _SP );
    foo( iAry );

    return 0;
}

void foo( int ia[5][10] )
{
    int i, j;

    /*  note how far stack pointer is decremented.  We can account for this 
        by suming:
            4 bytes for the return address
            2 bytes for a standard stack frame (save previous BP)
            4 bytes for a pointer to the passed array
            4 bytes for the two local int variables
        So, now the stack pointer is at 3992 - 14 = 3978.
    */
    cprintf( "SP in foo  = %u\r\n", _SP );
    for( i=0; i<5; i++ )
    {
        for( j=0; j<10; j++ )
        cprintf( "%6d", ia[i][j] ); cputs("\r\n");
    }
}
