window.$pagesCMS = {
  repo: RemyC2024/liste-de-naissance,
  branch: "main",

  site: {
    name: "Liste bébé – Myriam & Rémy"
  },

  collections: [
    {
      name: "site",
      label: "Page d’accueil",
      file: "content/site.json",
      fields: [
        { name: "title", label: "Titre", type: "string" },
        { name: "subtitle", label: "Texte d’introduction", type: "text" },
        {
          name: "badges",
          label: "Badges",
          type: "list",
          fields: [{ name: "label", label: "Badge", type: "string" }]
        }
      ]
    },

    {
      name: "produits",
      label: "Produits",
      file: "content/produits.json",
      fields: [
        {
          name: "items",
          label: "Liste des produits",
          type: "list",
          itemLabel: "title",
          fields: [
            { name: "order", label: "Ordre", type: "number" },
            { name: "title", label: "Titre", type: "string" },
            { name: "price", label: "Montant indicatif", type: "string" },
            { name: "description", label: "Description", type: "text" },
            { name: "image", label: "Image", type: "image", required: false }
          ]
        }
      ]
    },

    {
      name: "paiement",
      label: "Page Paiement",
      file: "content/paiement.json",
      fields: [
        { name: "title", label: "Titre", type: "string" },
        { name: "intro", label: "Introduction", type: "text" },

        {
          name: "bloc_form",
          label: "Bloc formulaire",
          type: "object",
          fields: [
            { name: "title", label: "Titre", type: "string" },
            { name: "text", label: "Texte", type: "text" },
            { name: "google_forms_embed_url", label: "URL Google Form (embed)", type: "string" },
            { name: "iframe_height", label: "Hauteur formulaire", type: "number" }
          ]
        },

        {
          name: "bloc_lydia",
          label: "Lydia",
          type: "object",
          fields: [
            { name: "title", label: "Titre", type: "string" },
            { name: "text", label: "Texte", type: "text" },
            { name: "handle", label: "Pseudo Lydia", type: "string" },
            { name: "link", label: "Lien Lydia", type: "string", required: false }
          ]
        },

        {
          name: "bloc_wero",
          label: "Wero",
          type: "object",
          fields: [
            { name: "title", label: "Titre", type: "string" },
            { name: "text", label: "Texte", type: "text" }
          ]
        },

        {
          name: "bloc_cb",
          label: "Carte bancaire",
          type: "object",
          fields: [
            { name: "title", label: "Titre", type: "string" },
            { name: "text", label: "Texte", type: "text" },
            { name: "note", label: "Note HelloAsso", type: "text" },
            { name: "helloasso_link", label: "Lien HelloAsso", type: "string" },
            { name: "button_text", label: "Texte bouton", type: "string" }
          ]
        }
      ]
    }
  ]
};
