# Configuration WordPress pour Next.js

Ce guide vous explique comment configurer WordPress pour que votre site Next.js puisse récupérer les articles via l'API REST.

## 📋 Prérequis

1. WordPress installé et fonctionnel
2. Accès à l'administration WordPress
3. L'URL de votre site WordPress (ex: `https://monsite.com`)

## 🔧 Étapes de configuration

### 1. Activer l'API REST WordPress

L'API REST WordPress est **activée par défaut** depuis WordPress 4.7+. Aucune action n'est nécessaire.

Pour vérifier que l'API fonctionne, visitez :
```
https://votre-site-wordpress.com/wp-json/wp/v2/posts
```

Vous devriez voir une réponse JSON avec vos articles.

### 2. Configurer les variables d'environnement

Dans votre projet Next.js, créez ou modifiez le fichier `.env.local` :

```bash
WORDPRESS_URL=https://votre-site-wordpress.com
WORDPRESS_HOSTNAME=votre-site-wordpress.com
WORDPRESS_WEBHOOK_SECRET=votre-secret-key-aleatoire-ici
```

**Important :**
- `WORDPRESS_URL` : L'URL complète de votre site WordPress (avec https://)
- `WORDPRESS_HOSTNAME` : Le nom de domaine uniquement (sans https://)
- `WORDPRESS_WEBHOOK_SECRET` : Une clé secrète aléatoire pour la sécurité (générez-en une avec un générateur de mots de passe)

### 3. Créer des articles de test

1. Connectez-vous à l'administration WordPress (`/wp-admin`)
2. Allez dans **Articles → Ajouter**
3. Créez quelques articles avec :
   - Un titre
   - Du contenu
   - Une image mise en avant (optionnel mais recommandé)
   - Une catégorie
   - Des tags (optionnel)

### 4. Publier les articles

Assurez-vous que vos articles sont **publiés** (statut "Publié"), pas en brouillon.

### 5. Vérifier les permissions de l'API

Par défaut, l'API REST WordPress est accessible publiquement pour la lecture. Si vous avez des problèmes :

1. Vérifiez que votre site WordPress est accessible publiquement
2. Vérifiez qu'il n'y a pas de plugin de sécurité qui bloque l'API REST
3. Testez l'URL de l'API directement dans votre navigateur

## 🧪 Test de l'API

Testez ces URLs dans votre navigateur pour vérifier que tout fonctionne :

- **Articles** : `https://votre-site-wordpress.com/wp-json/wp/v2/posts`
- **Catégories** : `https://votre-site-wordpress.com/wp-json/wp/v2/categories`
- **Tags** : `https://votre-site-wordpress.com/wp-json/wp/v2/tags`
- **Auteurs** : `https://votre-site-wordpress.com/wp-json/wp/v2/users`

## 🔒 Sécurité (Optionnel mais recommandé)

### Activer CORS si nécessaire

Si votre WordPress et Next.js sont sur des domaines différents, vous devrez peut-être configurer CORS. Ajoutez ce code dans le fichier `functions.php` de votre thème :

```php
function add_cors_headers() {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
}
add_action('init', 'add_cors_headers');
```

### Plugin de revalidation (Optionnel)

Pour que Next.js se mette à jour automatiquement quand vous modifiez un article dans WordPress, installez le plugin fourni dans le dossier `plugin/next-revalidate/`.

## ✅ Checklist

- [ ] WordPress est installé et accessible
- [ ] L'API REST fonctionne (testez l'URL `/wp-json/wp/v2/posts`)
- [ ] Les variables d'environnement sont configurées dans `.env.local`
- [ ] Au moins un article est publié dans WordPress
- [ ] Le serveur Next.js est redémarré après avoir modifié `.env.local`
- [ ] La page `/posts` affiche les articles

## 🐛 Dépannage

### Erreur "WordPress API request failed"

1. Vérifiez que `WORDPRESS_URL` est correct dans `.env.local`
2. Vérifiez que l'URL WordPress est accessible (testez dans le navigateur)
3. Vérifiez qu'il n'y a pas de redirection HTTPS/HTTP
4. Vérifiez les logs du serveur Next.js

### Aucun article n'apparaît

1. Vérifiez que vous avez des articles **publiés** (pas en brouillon)
2. Vérifiez que l'API REST retourne bien des articles (testez l'URL directement)
3. Vérifiez la console du navigateur pour les erreurs
4. Vérifiez les logs du serveur Next.js

### Images ne s'affichent pas

1. Vérifiez que `WORDPRESS_HOSTNAME` est correct
2. Vérifiez que les images sont bien attachées aux articles dans WordPress
3. Vérifiez la configuration dans `next.config.ts`

## 📚 Ressources

- [Documentation WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Documentation Next.js](https://nextjs.org/docs)

