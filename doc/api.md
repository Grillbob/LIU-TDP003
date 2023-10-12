Module api
==========
API routing factory.

Variables
---------

    
`api`
:   Flask child-router for API routes.

Functions
---------

    
`notFound(path: str)`
:   API catch-all route, essentially if not practically a regular 404 page.

    
`projects()`
:   API route returning project data from `data.json`.