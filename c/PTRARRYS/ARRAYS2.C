/*  The comments in the program assume compiling in the large memory model
    where pointers default to far and are 4 bytes each.
*/

/*  One way to simplify the syntax of passing multidimensional arrays is to
    use a typedef and constants for the dimensions.  This makes the syntax 
    of passing the array easier to read (and type) and the constants are 
    subsequently available for bounding array indexing.
*/

#include <conio.h>
#include <mem.h>

/* use #define constants to dimension the array */
#define DIM1 5
#define DIM2 10

/* TIntAry is a derived type for our array */
typedef int TIntAry[DIM1][DIM2];

void ShowAry( TIntAry );

int main( void )
{
    /*  As in arrays1.c, the size of the array is 5 * 10 * 2 = 100 bytes.  
        Adding in the two int variables, the first report of the stack 
        pointer will show SP = 3992.
    */

    int i, j;
    TIntAry iAry;

    cprintf( "sizeof( TIntAry ) = %u\r\n", sizeof( TIntAry ) );
    cprintf( "sizeof( iAry ) = %u\r\n", sizeof( iAry ) );
    cprintf( "SP in main = %u\r\n", _SP );

    /* put some values in the array */
    for( i=0; i<DIM1; i++ )
    {
        for( j=0; j<DIM2; j++ )
            iAry[i][j] = i * sizeof( iAry[0] )
                            + j * sizeof( iAry[0][0] );
    }

    /* pass the array to function that will display the contents */
    ShowAry( iAry );

    return 0;
}

void ShowAry( TIntAry putAry )
{
    /*  Although we thought we just passed sizeof( TIntAry ) on the stack,
        a pointer was actually passed.  Thus the overhead of this function 
        is sizeof( void* ) + 2 * sizeof( int ) = 8.  Additionally,  we 
        normally use standard stack frames which will use two bytes on the 
        stack, and the return address (4 bytes) will also be pused.  So the 
        total overhead is 14 bytes, and the stack pointer will now be 
        decremented to 3992 - 14 = 3978.

        We also demonstrate making a local copy by calling memcpy. This 
        requires declaring a local instance of TIntAry, so there goes 
        another 100 bytes off the stack, and so SP ends up at 3878.
    */

    int i, j;
    TIntAry ia;

    memcpy( ia, putAry, sizeof( TIntAry ) );
    cprintf( "SP in ShowAry = %u\r\n", _SP );

    for( i=0; i<DIM1; i++ )
    {
        for( j=0; j<DIM2; j++ )
            cprintf( "%6d", ia[i][j] );
        cputs( "\r\n" );
    }
    cputs( "\r\n" );
}
