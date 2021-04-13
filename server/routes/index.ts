require('./redirects'); // Redirect needed v3 routes;
require('./pubRedirects');

/* Routes for Communities */
require('./pubDocument');
require('./pubDownloads');
require('./collection'); // Route: /collection/:id
require('./dashboardActivity');
require('./dashboardDiscussions');
require('./dashboardEdges');
require('./dashboardImpact');
require('./dashboardMembers');
require('./dashboardCommunityOverview');
require('./dashboardCollectionOverview');
require('./dashboardPubOverview');
require('./dashboardPage');
require('./dashboardPages');
require('./dashboardReview');
require('./dashboardReviews');
require('./dashboardSettings');
require('./dashboardCollectionLayout');

/* Routes for PubPub */
require('./communityCreate'); // Route: '/community/create'
require('./explore'); // Route: '/explore'
require('./about'); // Route: '/about'
require('./pricing'); // Route: '/pricing'

require('./adminDashboard'); // Route: '/admin'
require('./landing'); // Route: '/'

/* Routes for all */
require('./login'); // Route: '/login'
require('./legal'); // Route: '/legal'
require('./search'); // Route: '/search'
require('./signup'); // Route: '/signup'
require('./passwordReset'); // Route: ['/password-reset', '/password-reset/:resetHash/:slug']
require('./userCreate'); // Route: '/user/create/:hash'
require('./user'); // Route: ['/user/:slug', '/user/:slug/:mode']
require('./page'); // Route: ['/', '/:slug']
require('./sitemap'); // Route: /sitemap-*.xml
require('./robots'); // Route: /robots.txt
require('./noMatch'); // Route: '/*'
