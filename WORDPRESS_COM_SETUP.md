# Configuration pour WordPress.com

## ⚠️ Important : Limitations de WordPress.com

WordPress.com a des **limitations sur l'API REST** pour les sites gratuits. Voici comment configurer et résoudre les problèmes.

## 📝 Configuration du .env.local

Le fichier `.env.local` a été créé avec cette configuration :

```bash
WORDPRESS_URL=https://zebretestwp.wordpress.com
WORDPRESS_HOSTNAME=zebretestwp.wordpress.com
WORDPRESS_WEBHOOK_SECRET=changez-moi-par-une-cle-secrete-aleatoire
```

**⚠️ Important :** Changez `WORDPRESS_WEBHOOK_SECRET` par une clé secrète aléatoire (vous pouvez utiliser un générateur de mots de passe).

## 🔧 Étapes pour activer l'API REST sur WordPress.com

### Option 1 : Vérifier que le site est public

1. Allez sur https://zebretestwp.wordpress.com/wp-admin
2. Allez dans **Réglages → Confidentialité**
3. Assurez-vous que le site est **public** (pas privé ou protégé par mot de passe)

### Option 2 : Utiliser l'API publique de WordPress.com

Pour WordPress.com, l'API peut nécessiter une authentification. Testez cette URL dans votre navigateur :

```
https://public-api.wordpress.com/rest/v1.1/sites/zebretestwp.wordpress.com/posts
```

Si cette URL fonctionne, vous devrez peut-être modifier le code pour utiliser l'API WordPress.com au lieu de l'API REST standard.

### Option 3 : Migrer vers un WordPress auto-hébergé

Si vous avez besoin d'un contrôle complet sur l'API REST, vous pouvez :
- Installer WordPress sur votre propre serveur
- Utiliser un hébergeur WordPress (comme OVH, Hostinger, etc.)
- Utiliser WordPress.org (auto-hébergé)

## 🧪 Tester l'API REST

Testez ces URLs dans votre navigateur :

1. **API REST standard :**
   ```
   https://zebretestwp.wordpress.com/wp-json/wp/v2/posts
   ```

2. **API WordPress.com :**
   ```
   https://public-api.wordpress.com/rest/v1.1/sites/zebretestwp.wordpress.com/posts
   ```

Si aucune ne fonctionne, l'API REST n'est probablement pas accessible publiquement sur votre site WordPress.com.

## ✅ Solutions alternatives

### Solution 1 : Utiliser un WordPress auto-hébergé

Installez WordPress sur votre propre serveur pour avoir un contrôle total sur l'API REST.

### Solution 2 : Utiliser l'API WordPress.com avec authentification

Si vous avez un compte WordPress.com, vous pouvez utiliser l'API avec authentification OAuth.

### Solution 3 : Exporter les articles via RSS

Vous pouvez utiliser le flux RSS de WordPress comme alternative :
```
https://zebretestwp.wordpress.com/feed/
```

## 🔄 Redémarrer le serveur Next.js

Après avoir modifié `.env.local`, **redémarrez toujours le serveur** :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis relancez :
pnpm dev
```

## 🐛 Dépannage

### Erreur "WordPress API request failed"

1. Vérifiez que le site WordPress.com est **public**
2. Testez l'URL de l'API directement dans votre navigateur
3. Vérifiez les logs du serveur Next.js
4. Essayez l'API WordPress.com alternative

### Aucun article n'apparaît

1. Vérifiez que vous avez des articles **publiés** dans WordPress
2. Vérifiez que le site n'est pas en mode privé
3. Testez l'API directement dans le navigateur

## 📚 Ressources

- [Documentation WordPress.com API](https://developer.wordpress.com/docs/api/)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

