$(document).ready(function() {
    $('.gallery').mauGallery({
        columns: {
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3
        },
        lightBox: true,
        lightboxId: 'myAwesomeLightbox',
        showTags: true,
        tagsPosition: 'top'
    });
});

//service worker

if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
    console.log('Service Worker enregistré avec succès:', registration);
    })
    .catch(function(error) {
    console.log("Échec de l'enregistrement du Service Worker:", error);
    });
}
