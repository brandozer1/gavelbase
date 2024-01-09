THE NUMBER 1 GOAL IN THIS CODE IS CLARITY AND EDITABILLITY. SIZE AND SPEED ARE 2nd.

Use Comments everywhere and prudently. 



INTERNAL FILE STRUCTURE:               1/7/2024

    The order of the parts of a file should be exactly or close to this

    1. Notes-Imports
    2. Constants
    3. Hooks-States
    4. Functions
    5. Component Function

FUNCTIONS:                               1/7/2024

    When Writing, function as many single useful events as possible for future use.

    FUNCTIONS IN LIBARY (Lib.js in /Hooks/Lib.js)
    NONE YET

FUNCTIONAL NAMING CONVENTION (CODE ONLY)  1/7/2024

    STATE VARIABLES:

        Prefix Booleans(True/False) Varaibles with "is" or "has" or "should"

        Aside from that, use Pascal Case See below or google it

        Good:
            isActive, setIsActive
            hasErrors, setHasErrors
            shouldRender, setShouldRender


    VARIABLES:
        
        Camel Case is always the main recommendation. If you need to use something else Comment it.
        Google for more examples

        Good:
            helloWorld
            hello
            variableName
        
        Bad:
            HELLOWORLD
            Hello
            hello_World

        Variable names should be prudently named for the scope of the function. Globals ESPECIALLY!

    CLASSNAMES & CONSTRUCTORS:

        Use PASCAL CASE WITH HYPHENS. Google it or see below.

        BE SPECIFIC. CLASSNAMES ARE GLOBAL IN REACT. WHEN NAMING USE FULL NAMES THAT ARE VERY SPECIFIC AND THAT CANNOT BE MISTAKENLY USED ELSEWHERE.
    


Component Index                  1/7/2024

    Index.js: Root of the react setup includes root setup. Contains no Practical Code but is required

    App.js: Needs to be under Index.js and contains all React Routing for directories, may contain other code aswell but routing is the primary function. 

    UI Components: (Larger more specific Components)

        Nav.js: Header with navigation for all pages May be switched out for future Dashboard nav when users are using dashboard. or vice versa. 

        Page.js: Used as a container for all pages. Contains all margins and padding that each page will have for consistancy and will have options for changing them in the future. Also Contains nav and applies to each page.



Page Index                          1/7/2024

    Home.js: Landing page as of now. May contain purchasing and login options in the future.    

-------------------------------FILES AND STRUCTURE------------------------------------
Component and File Naming Convention                  1/7/2024

    Google PascalCase for more examples.

    Captialize Every Word of the file name. 

    Use full words and no shorthands when naming components.

    GOOD:
        Home.js
        HomePage.js
        UserNavigation.js
    BAD:
        homePage.js
        UsrNav.js
        Usernavigation.js

    Each Component is names as Unique as possible relative to its level on the tree. For example: the name Home.js is not very unique but since it is so important and is basically the top/first thing any user will see this works.

    If a component is to be used constanstly DO NOT give it an uselessly Long name. It is annoying.

File Convention

    Each Component is wrapped in a folder of the same name excluding file extension. So "Home.js" is inside "/Home", This allows for more customization if you need to apply a css file specific to the Component, you can put the css folder inside "/Home" and everyone will know where it is.

Current Full Project File Structure      1/7/2024

```
└── 📁gavelbase                     ROOT
    └── .gitattributes
    └── .gitignore
    └── package-lock.json
    └── package.json
    └── 📁public
        └── favicon.ico
        └── index.html
        └── logo192.png
        └── logo512.png
        └── manifest.json
        └── robots.txt
    └── README.md
    └── 📁src                         MAIN FOLDER
        └── App.css 
        └── App.js                     REACT ROUTER
        └── 📁Assets                  ASSETS, MUSIC, PICTURES ETC
            └── complete.mp3
            └── fail.mp3
            └── fasttracklogo.png
            └── LandingBackground.png
            └── Logo.jpg
            └── Logo.png
            └── Logo.webp
            └── success.mp3
        └── 📁Components               HOLDS REACT COMPONENTS
            └── 📁Shade                Shade Components from library
            └── 📁Ui                   Larger more specific and handmade components
                └── 📁Nav
                    └── Nav.js
                └── 📁Page
                    └── Page.js
        └── index.css
        └── index.js
        └── 📁Pages                     Larged form of components, entire pages
            └── 📁Home
                └── Home.js
        └── setupTests.js
    └── tailwind.config.js
```