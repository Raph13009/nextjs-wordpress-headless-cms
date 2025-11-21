# Revalidation Automatique pour WordPress.com

## 🎯 Problème

Sur WordPress.com, vous ne pouvez pas installer de plugins personnalisés, donc le plugin de revalidation automatique ne fonctionne pas.

## ✅ Solutions

### Solution 1 : Revalidation Manuelle (Simple)

Après avoir publié un article sur WordPress.com, appelez cette URL :

```
https://votre-site-nextjs.com/api/revalidate/manual?secret=VOTRE_SECRET
```

**Exemple :**
```
https://monsite.vercel.app/api/revalidate/manual?secret=ma-cle-secrete
```

**Avantages :**
- Simple et rapide
- Fonctionne immédiatement
- Pas besoin de configuration complexe

**Inconvénients :**
- Vous devez appeler l'URL manuellement après chaque publication

### Solution 2 : Utiliser Zapier ou IFTTT (Automatique)

Créez un "Zap" ou "Applet" qui :
1. Détecte quand un nouvel article est publié sur WordPress.com
2. Appelle l'URL de revalidation

**Configuration Zapier :**
1. Créez un compte sur [Zapier.com](https://zapier.com)
2. Créez un nouveau "Zap"
3. **Trigger** : WordPress.com → "New Post Published"
4. **Action** : Webhooks by Zapier → "POST"
   - URL : `https://votre-site-nextjs.com/api/revalidate/manual`
   - Method : POST
   - Headers : `x-webhook-secret: VOTRE_SECRET`
   - Body : `{}`

**Avantages :**
- Complètement automatique
- Fonctionne en arrière-plan
- Gratuit jusqu'à 100 tâches/mois

### Solution 3 : Script Automatique (Avancé)

Créez un script qui vérifie périodiquement les nouveaux articles et déclenche la revalidation.

## 🔧 Configuration

### 1. Obtenir votre secret

Votre secret est défini dans `.env.local` :
```bash
WORDPRESS_WEBHOOK_SECRET=votre-cle-secrete
```

### 2. Tester la revalidation manuelle

Testez avec curl :
```bash
curl "https://votre-site.com/api/revalidate/manual?secret=votre-cle-secrete"
```

Ou dans votre navigateur :
```
https://votre-site.com/api/revalidate/manual?secret=votre-cle-secrete
```

Vous devriez voir :
```json
{
  "revalidated": true,
  "message": "All WordPress content revalidated",
  "timestamp": "2025-11-21T..."
}
```

## 🚀 Workflow Recommandé

### Pour le Développement Local

1. Publiez un article sur WordPress.com
2. Ouvrez : `http://localhost:3001/api/revalidate/manual?secret=votre-secret`
3. Rafraîchissez `/posts` - votre article apparaît immédiatement !

### Pour la Production (Vercel)

1. Configurez Zapier (Solution 2) pour automatiser
2. OU créez un bookmark dans votre navigateur avec l'URL de revalidation
3. Cliquez sur le bookmark après chaque publication

## 📝 Exemple de Bookmark

Créez un bookmark avec cette URL (remplacez les valeurs) :
```
javascript:(function(){fetch('https://votre-site.com/api/revalidate/manual?secret=VOTRE_SECRET').then(r=>r.json()).then(d=>alert(d.message))})()
```

Cliquez sur ce bookmark après avoir publié un article !

## 🔒 Sécurité

⚠️ **Important :** Ne partagez jamais votre secret publiquement. Gardez-le dans `.env.local` et ne le commitez jamais dans Git.

## 🐛 Dépannage

### La revalidation ne fonctionne pas

1. Vérifiez que `WORDPRESS_WEBHOOK_SECRET` est bien défini dans `.env.local`
2. Vérifiez que vous utilisez le bon secret dans l'URL
3. Vérifiez les logs de votre serveur Next.js
4. En production, vérifiez les logs Vercel

### Les articles n'apparaissent toujours pas

1. Attendez 30-60 secondes (cache en développement)
2. Forcez le refresh avec Ctrl+Shift+R
3. Vérifiez que l'article est bien publié (pas en brouillon) sur WordPress.com

