CFLAGS=-Wall -g -ansi -pedantic
VER=0.2
.PHONY: clean

test: test.c list.o list.h
	gcc $(CFLAGS) -o test test.c list.o

list.o: list.c list.h
	gcc -c $(CFLAGS) list.c

dist: list.c list.h COPYING Makefile test.c
	mkdir liblist-$(VER)
	cp $^ liblist-$(VER)
	tar jcf liblist-$(VER).tar.bz2 liblist-$(VER)
	rm -rf liblist-$(VER)

clean:
	rm -f list.o test core
