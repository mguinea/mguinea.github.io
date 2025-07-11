---
title: 'Cómo integrar una API externa'
description: 'Cómo integrar una API externa siguiendo buenas prácticas.'
pubDate: 'Aug 10 2021'
heroImage: '../../assets/integration-external-api.webp'
---

Estás desarrollando una aplicación que necesita integrarse con una API de terceros para obtener datos o alguna funcionalidad... pero ¿cuál es la mejor forma de abordarlo? ¿Debería usar algo en particular?

Como siempre, no hay una solución mágica o perfecta, pero voy a explicar lo que a mí me ha funcionado.

## Ejemplo de contexto

Lo primero que debemos hacer es definir exactamente qué queremos hacer y qué necesitamos.

> Nuestra aplicación necesita un servicio externo (API) que, dados un número mínimo y un número máximo, devuelva un número entero aleatorio.

Una vez definidos los requisitos y casos de uso, es hora de buscar el mejor servicio que los cubra.

> ¡Hemos encontrado un servicio que encaja! Vamos a crear un proveedor que implemente la API: [http://www.randomnumberapi.com](http://www.randomnumberapi.com)

## Definición

Ya hemos hecho el esfuerzo de entender qué necesitamos y cómo lo necesitamos, así que ahora toca definir un contrato (interfaz).

¿Y por qué? Porque si tenemos una interfaz que define los métodos y parámetros a utilizar, la implementación podrá cambiarse en cualquier momento sin romper la aplicación.

Necesitamos un nombre que identifique claramente lo que hace. Esta es una de las partes más complejas del desarrollo: **¡poner nombres!**

Consejos:

* No uses palabras vacías como `manager`.
* Relee la historia de usuario para sacar pistas.
* Nunca uses el nombre de la especificación que vas a implementar.
* Evita acrónimos o abreviaturas.

```php
interface RandomNumberProvider
{
    public function generate(int $min, int $max): int;
}
```

Ahora es momento de crear una clase que implemente esta interfaz.

## Implementación

Existen diferentes clientes HTTP que nos ayudan a conectar con APIs externas. Personalmente prefiero los que implementan los [estándares PSR](https://www.php-fig.org/psr/) siempre que sea posible.

Voy a usar [Guzzle](https://packagist.org/packages/guzzlehttp/guzzle), pero puedes usar el que prefieras.

Si estás utilizando Composer, simplemente ejecuta `composer require guzzlehttp/guzzle` para instalarlo como nueva dependencia en tu proyecto.

```php
use GuzzleHttp\Client as HttpClient;

final class RandomNumberAPIProvider implements RandomNumberProvider
{
    private HttpClient $client;

    public function __construct(HttpClient $client)
    {
        $this->client = $client;
    }

    public function generate(int $min, int $max): int
    {
        $response = $this->client->request('GET', 'http://www.randomnumberapi.com/api/v1.0/random?min='.$min.'&max='.$max.'&count=1');

        return json_decode($response->getBody(), true)[0];
    }
}
```

Aprovecha los beneficios del *Service Container* y vincula la interfaz con su implementación para mantener el principio de Inversión de Control (Inversión de Dependencias). Esto te permitirá cambiar la implementación por otra API o servicio sin romper la aplicación.

## Tests

Algunas APIs tienen limitaciones de uso o pueden incluso cobrarte por utilizarlas, aunque estés en entorno de desarrollo.

Una buena solución es **mockear** la API usando herramientas pensadas para ello.

Yo he utilizado [Killgrave](https://github.com/friendsofgo/killgrave) con muy buenos resultados. Lo mejor es que puedes configurar una API simulada simplemente con archivos de configuración en YAML.

## Conclusión

Es fácil sentirse abrumado al integrar una API externa, pero si comenzamos por pensar **qué necesitamos** y dejamos de lado la complejidad de la implementación específica, tendremos una mejor visión general y evitaremos caer en el infierno de los quebraderos de cabeza.

Las **interfaces** nos ofrecen separación de responsabilidades y evitan un acoplamiento rígido con una implementación externa. Esto nos da libertad para cambiar de proveedor si cambian nuestros requisitos.
