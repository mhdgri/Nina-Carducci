var mauGallery = {
  init: function (selector, options) {
    var defaults = {
      columns: {
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3
      },
      lightBox: true,
      lightboxId: null,
      showTags: true,
      tagsPosition: "bottom",
      navigation: true
    };

    var galleryElements = document.querySelectorAll(selector);
    options = Object.assign({}, defaults, options);
    var tagsCollection = [];
    var filteredImages = []; // Variable pour stocker les images filtrées

    galleryElements.forEach(function (gallery) {
      createRowWrapper(gallery);

      if (options.lightBox) {
        createLightBox(gallery, options.lightboxId, options.navigation);
      }

      gallery.querySelectorAll(".gallery-item").forEach(function (item) {
        responsiveImageItem(item);
        moveItemInRowWrapper(item);
        wrapItemInColumn(item, options.columns);

        var theTag = item.dataset.galleryTag;
        if (
          options.showTags &&
          theTag !== undefined &&
          tagsCollection.indexOf(theTag) === -1
        ) {
          tagsCollection.push(theTag);
        }

        filteredImages.push(item);

        // Gérer le clic sur l'image pour ouvrir la modale
        item.addEventListener("click", function () {
          if (options.lightBox && item.tagName === "IMG") {
            openLightBox(item, options.lightboxId);
          }
        });
      });

      if (options.showTags) {
        showItemTags(gallery, options.tagsPosition, tagsCollection);
      }

      gallery.style.display = "block";
    });

    // Gérer les listeners pour les filtres de tags
    document.querySelectorAll(".nav-link").forEach(function (navLink) {
      navLink.addEventListener("click", function () {
        // Supprimez la classe "active-tag" de tous les filtres
        document.querySelectorAll('.nav-link').forEach(function (navLink) {
          navLink.classList.remove('active-tag');
        });

        // Ajoutez la classe "active-tag" au filtre sélectionné
        navLink.classList.add('active-tag');

        filterByTag(navLink.getAttribute("data-images-toggle"));
      });
    });

    // Fonction pour créer un wrapper de ligne
    function createRowWrapper(element) {
      if (!element.querySelector(".gallery-items-row")) {
        var rowWrapper = document.createElement("div");
        rowWrapper.className = "gallery-items-row row";
        element.appendChild(rowWrapper);
      }
    }

    // Fonction pour envelopper un élément dans une colonne
    function wrapItemInColumn(element, columns) {
      var columnClasses = "";
      if (columns.constructor === Number) {
        columnClasses = "col-" + Math.ceil(12 / columns);
      } else if (columns.constructor === Object) {
        // Gérer les colonnes pour chaque taille d'écran
      } else {
        console.error("Columns should be defined as numbers or objects.");
      }

      var columnWrapper = document.createElement("div");
      columnWrapper.className = "item-column mb-4 col-12 col-sm-6 col-md-4 col-lg-4 col-xl-4 " + columnClasses;
      element.parentNode.appendChild(columnWrapper);
      columnWrapper.appendChild(element);
    }

    // Fonction pour déplacer un élément dans un wrapper de ligne
    function moveItemInRowWrapper(element) {
      element.parentNode.parentNode.querySelector(".gallery-items-row").appendChild(element);
    }

    // Fonction pour ajouter des classes pour les images réactives
    function responsiveImageItem(element) {
      if (element.tagName === "IMG") {
        element.classList.add("img-fluid");
      }
    }

    // Fonction pour créer la modale lightbox
    function createLightBox(gallery, lightboxId, navigation) {
      var lightBoxHTML = `
        <div class="modal fade" id="${lightboxId || "galleryLightbox"}" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-body">
                        ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;"><</div>' : '<span style="display:none;" />'}
                        <img class="lightboxImage img-fluid" alt="Contenu de l'image affichée dans la modale au clic"/>
                        ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;}">></div>' : '<span style="display:none;" />'}
                    </div>
                </div>
            </div>
        </div>`;
      gallery.insertAdjacentHTML("beforeend", lightBoxHTML);

      // Gérer les clics sur les boutons de navigation
      var modal = document.getElementById(lightboxId || "galleryLightbox");
      var lightboxImage = modal.querySelector(".lightboxImage");
      var currentIndex = 0;

      modal.querySelector(".mg-prev").addEventListener("click", function () {
        currentIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
        lightboxImage.src = filteredImages[currentIndex].src;
      });

      modal.querySelector(".mg-next").addEventListener("click", function () {
        currentIndex = (currentIndex + 1) % filteredImages.length;
        lightboxImage.src = filteredImages[currentIndex].src;
      });
    }

    // Fonction pour afficher les tags
    function showItemTags(gallery, position, tags) {
      var tagItems = '<li class="nav-item"><span class="nav-link active active-tag"  data-images-toggle="all">Tous</span></li>';
      tags.forEach(function (tag) {
        tagItems += `<li class="nav-item active">
                <span class="nav-link"  data-images-toggle="${tag}">${tag}</span></li>`;
      });
      var tagsRow = `<ul class="my-4 tags-bar nav nav-pills">${tagItems}</ul>`;

      if (position === "bottom") {
        gallery.insertAdjacentHTML("beforeend", tagsRow);
      } else if (position === "top") {
        gallery.insertAdjacentHTML("afterbegin", tagsRow);
      } else {
        console.error(`Unknown tags position: ${position}`);
      }
    }

    // Fonction pour filtrer les images par tag
    function filterByTag(tag) {
      filteredImages = [];

      document.querySelectorAll(".gallery-item").forEach(function (item) {
        var itemTag = item.dataset.galleryTag;
        var column = item.closest(".item-column");

        if (tag === "all" || itemTag === tag) {
          column.style.display = "block";
          filteredImages.push(item);
        } else {
          column.style.display = "none";
        }
      });
    }

    // Fonction pour ouvrir la modale avec l'image
    function openLightBox(item, lightboxId) {
      var modal = document.getElementById(lightboxId || "galleryLightbox");
      var lightboxImage = modal.querySelector(".lightboxImage");
      lightboxImage.src = item.src;
      currentIndex = filteredImages.indexOf(item);
      modal.classList.add("show");
      modal.style.display = "block";
    }
  }
};

document.addEventListener("DOMContentLoaded", function () {
  mauGallery.init(".gallery", {
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

function closeLightBoxOutsideModal() {
  var modal = document.querySelector(".modal.show");
  if (modal) {
    modal.classList.remove("show");
    modal.style.display = "none";
  }
}

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("modal")) {
    closeLightBoxOutsideModal();
  }
});