---
title: 'Feature Flags: Activa o desactiva funcionalidades en tiempo de ejecución'
description: 'Feature Flags: Activa o desactiva funcionalidades en tiempo de ejecución'
pubDate: 'Aug 06 2021'
heroImage: '../../assets/feature-flags-symfony.webp'
---

Una *feature flag*, también conocida como *feature switch*, es una funcionalidad que permite activar o desactivar partes de tu aplicación en tiempo de ejecución, según tus necesidades.

## ¿Por qué usar feature flags?

Existen múltiples razones para incorporar feature flags en tu proyecto:

1. Quieres que una funcionalidad esté disponible solo para un cliente específico inicialmente.
2. Necesitas desplegar una funcionalidad que aún no está finalizada.
3. La funcionalidad está lista para producción, pero debe activarse en una fecha determinada para su uso público o mediante una API.

## ¿Cómo implementarlas?

Primero, definimos una interfaz que nos permita abstraer la lógica de verificación de la flag:

```php
interface FeatureChecker
{
    public function isEnabled(string $feature): bool;
}
```

A partir de aquí, podemos crear diferentes implementaciones. Empezaremos por la más simple: una implementación en memoria.

```php
class InMemoryFeatureChecker implements FeatureChecker
{
    private array $features;

    public function __construct(array $features = [])
    {
        $this->features = $features;
    }

    public function isEnabled(string $feature): bool
    {
        return $this->features[$feature] ?? false;
    }
}
```

Si estás utilizando Symfony, puedes aprovechar el *Service Container* para configurar las feature flags a través de un archivo `yml`, e inyectarlas cuando se necesite.

Primero registramos el servicio:

```yml
services:
    InMemoryFeatureChecker:
        public: true
        arguments:
            - '%features%'
```

Luego definimos los parámetros de configuración:

```yml
parameters:
    features:
        {
            foo: false,
            bar: true
        }
```

## Ejemplo práctico

Imagina que tienes un *endpoint* ya implementado pero que no debería estar activo aún. Podrías usar la feature flag así:

```php
class SomeController
{
    private FeatureChecker $featureChecker;

    public function __construct(FeatureChecker $featureChecker) 
    {
        $this->featureChecker = $featureChecker;
    }

    public function __invoke(Request $request): JsonResponse
    {
        if (false === $this->featureChecker->isEnabled('foo')) {
            // Lanza una excepción o devuelve una respuesta de error
        }

        // Lógica del endpoint aquí...
    }
}
```

## Conclusión

Gracias a esta interfaz, puedes implementar el control de flags de la forma que mejor se adapte a tus necesidades: desde archivos `yml`, Redis, MySQL, etc.

Las feature flags te ofrecen una herramienta muy útil para gestionar la activación o desactivación de funcionalidades en tu aplicación sin necesidad de hacer despliegues.

En este artículo hemos visto una implementación básica, pero fácilmente extensible para incluir lógica adicional como activación por usuario, control de uso, fechas específicas de activación, etc.
