#ifndef _LIST_H_
#define _LIST_H_
/*****************************************************************
 * list.c: Generic pointed list specification 
 *
 * It uses an "interest point" (CURRENT item from now) that
 * indicates the item to manage (delete, insert, ...) You can move
 * pointer forward, and to the beginning of the list.
 *
 * Current pointer can be set from the first element of the list to the
 * space after the last one. Just think on it like the console/shell
 * cursor.
 *
 * -----     -----     -----     -----     
 * |   |---->|   |---->|   |---->|   |--//
 * -----     -----     -----     -----    
 *             ^
 *             |___ current            
 *
 *    Copyright (C) 2004 Luis Alberto Giménez <algibe@teleline.es>
 *
 *    This program is free software; you can redistribute it and/or modify
 *    it under the terms of the GNU General Public License as published by
 *    the Free Software Foundation; either version 2 of the License, or
 *    (at your option) any later version.
 *
 *    This program is distributed in the hope that it will be useful,
 *    but WITHOUT ANY WARRANTY; without even the implied warranty of
 *    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *    GNU General Public License for more details.
 *
 *    You should have received a copy of the GNU General Public License
 *    along with this program; if not, write to the Free Software
 *    Foundation, Inc., 675 Mass Ave, Cambridge, MA 02139, USA.
 *
 * $Id: list.h,v 1.4 2004/09/04 02:43:18 alberto Exp $
 *
 * ***************************************************************/

/* opaque incomplete object */
typedef struct List list;

/* ------------------ Auxiliary functions ----------------------- 
 *
 * These functions help this library to store elements of arbitrary size
 * and type. You must provide them to the init function (list_create),
 * so the library can know how to store/delete your objects. */

/* This function duplicates an object in to dynamically allocated
 * memory, returning a pointer to the new object. */
typedef void *(*list_objdupfn) (void *);

/* This function cleans memory allocated for an object. It is used to
 * delete items in the list and by de list_destroy function. Doesn't
 * return anything */
typedef void (*list_objfreefn) (void *);
/* ---------------- END Aux functions --------------------------- */

/* creates a void list for object references.
 * Returns NULL if not enough memory */
list *list_create (list_objdupfn objdup, list_objfreefn objfree);

/* destroys an entire list */
int list_destroy (list *lst);

/*
 * Adds an ITEM before the point of interest. It remains in the same
 * object it was pointing before insert operation.
 * Returns 0 on exit, -1 on error.
 */
int list_insert (list *lst, void *item);

/*
 * Deletes Current item, "moving" Current to the next element.
 * Returns 0 if ok, -1 if empty or end of list 
 */
int list_delete (list *lst);

/*
 * Returns Current element, or NULL if Current pointer is in the right. 
 */
void *list_current (list *lst);

/*
 * returns 1 if list is empty, 0 otherwise
 */
int list_empty (list *lst);


/**************************************************************
 * Current item pointer handling
 * ************************************************************/
/* 
 * Move Current pointer to the first element of the list (rewind)
 */
void list_reset (list *lst);

/*
 * Move Current pointer to the next element. Returns 0 if ok, -1 if it
 * Current is the last element
 */
int list_next (list *lst);

/*
 * Returns 1 if Current pointer is in the right of the list,
 * 0 otherwise
 */
int list_end (list *lst);
/***************************************************************/

#endif	/* LIST_H */
