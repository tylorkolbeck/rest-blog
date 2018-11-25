// THIS IS A CUSTOM MIDDLEWARE CURRENTLY IN THE WORKS.
// I HOPE TO EVENTUALLY LOG TO A TEXT LOG FILE FOR HISTORY 
// OF INCOMING REQUESTS WITH TIMESTAMP AND ADDRESS.
// JUST IGNORE THIS FILE

exports.requestTime = (req, res, next) => {
    const now = new Date()
    req.requestTime = now + ':'
    console.log('[LOGGER]' + req.method + req.routes + " - " + now + ':')
    next()
}

