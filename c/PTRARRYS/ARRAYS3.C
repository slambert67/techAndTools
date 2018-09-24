/*  The comments in the program assume compiling in the large memory model
    where pointers default to far and are 4 bytes each.
*/

/*  Now we'll modify arrays2.c to use pointers.  This will allow us to use
    dynamic memory allocation for the array and  - not having to declare it 
    as a local variable - ease the load on the stack.
*/

#include <conio.h>
#include <mem.h>
#include <alloc.h>
#include <stdlib.h>

/* use #define constants to dimension the array */
#define DIM1 5
#define DIM2 10

typedef int TIntAry[DIM1][DIM2];

void ShowAry( TIntAry* );

int main( void )
{
    /*  now we only allocate 4 bytes for the TIntAry* instead of 100 bytes 
        for the whole array, so the stack usage is 4 + 2 * sizeof( int ) = 
        8 bytes and SP = 4096 - 8 = 4088.
    */

    int i, j;
    TIntAry *iAryPtr;

    cprintf( "sizeof( TIntAry ) = %u\r\n", sizeof( TIntAry ) );
    cprintf( "sizeof( iAryPtr ) = %u\r\n", sizeof( iAryPtr ) );
    cprintf( "SP in main = %u\r\n", _SP );

    /* allocate some space for a TIntAry and let iAryPtr point to it */
    iAryPtr = ( TIntAry* ) malloc( sizeof( TIntAry ) );
    if( iAryPtr == NULL )
        exit( 1 );

    /* and put something in the array for us to view */
    for( i=0; i<DIM1; i++ )
    {
        for( j=0; j<DIM2; j++ )
            /* Now we also must dereference the pointer */
            (*iAryPtr)[i][j] = i * sizeof( (*iAryPtr)[0] )
                                + j * sizeof( int );
    }

    /* ShowAry now takes a pointer to the type */
    ShowAry( iAryPtr );

    return 0;
}


void ShowAry( TIntAry *parentPtr )
{
    /*  This time we passed 4 bytes for the pointer.  We also use dynamic 
        memory allocation for the local copy, so the requiremend for 
        autovariables is only 8 bytes, plus the standard overhead of a 
        function call = 18 bytes, and SP ends up at 4088 - 12 = 4070.
    */

    int i, j;
    TIntAry *localPtr;

    cprintf( "SP in ShowAry = %u\r\n", _SP );

    localPtr = ( TIntAry* ) malloc( sizeof( TIntAry ) );
    if( localPtr == NULL )
        exit( 1 );
    memcpy( localPtr, parentPtr, sizeof( TIntAry ) );

    for( i=0; i<DIM1; i++ )
    {
        for( j=0; j<DIM2; j++ )
            cprintf( "%6d", (*localPtr)[i][j] );
        cputs( "\r\n" );
    }
    cputs( "\r\n" );
}
