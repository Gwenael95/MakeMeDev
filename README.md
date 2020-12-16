
# MakeMeDev
2020 Web project at Coding factory, MakeMeDev aim to allow users
to post and search functions from other developers.

* [Initialisation](#Initialisation)
* [User](#User)
* [Search](#Search)

## Initialisation
To run this server:

    node index.js
    
## User
### Signed in user
Signed in user will create an account with mail, pseudo, password.
It will allow to post new functions to solve a problematic.

This user will have to :
-   give a name to his function
-   describe the function, how it works, which problem it solve ...
-   define all arguments and returns values :
    -   type 
    -   name 
    -   description
    -   default value (`for arguments, not required`)
-   add tags

Other signed in users may propose to enhance this function,
they just have to add a post on the function they want.
The rest of the community will elect the optimal solution by voting 
thanks to like and dislike.

This will allow every user, even if not registered, to find solution to
their issues thanks to the dev community.

### Utilisateur non connecté (visiteur)

Unregistered user may only explore all functions, but won't
participate to develop the MakeMeDev community.

## Search
### Which are criteria to search function
You can search function by: 
-   name
-   params type 
-   returns type
-   description
-   tags

### How to write it
#### Function name
If you want to search by function name, 
first step is to write it.
Function name is `always` at the beginning of a request.
>This name could be uncompleted, we search function with a name
>containing your searched name.

Example:

```
accurate name       => sortMyArray
less precise name   => sortMy      
```

#### Params
If you want to search by params, 
first step is to write brackets `()`.
Into those brackets, write the type of params to search.
>The number of params is important, you can search function without params 
>with single brackets.
>
>Moreover, if you want to search function without knowing all params type, replace
>the unknown ones by ?

Examples:
```
no params           => ()
one int             => (int)
2 int, 1 array      => (int, int, array)
1 int, 2 unknowns   => (int, ?, ?)
```

#### Returns
If you want to search by returns, 
first step is to write braces `{}`.
Into those braces, write the type of returns to search.
>Refer to [Params](#Params) for details explanations on types.

Examples:
```
no returns      => {}
unknown         => {?}
one int or null => {int, null}
```

#### Description
If you want to search by description, 
first step is to write double quote `""`.
Then, write a complete or a part of the description.

Example:

```
accurate description       => "a function to sort array returning the new array or null if isn't of type array"
less precise description   => "function to sort"      
```

#### Tags
If you want to search by tags, first step is to write square brackets `[]`.
Into those square brackets, write all tags you want to search.
>We search all function with all your tags or more.
>Empty brackets mean you want a function without any tag

Example:

```
1 tags => [sort]
2 tags => [sort, easy]    
```

### Combination
Each of those could be used to search function or not.
You can use a combination of these to accurate your search.

Find below an example of search request:

`functionName(int, int){int, ?} "function to multiply" [tag, tag]`


