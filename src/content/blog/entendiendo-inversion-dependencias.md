---
title: 'Entendido la inversión de dependencias'
description: 'Entendido la inversión de dependencias IoC Service Container'
pubDate: 'Aug 10 2021'
heroImage: '../../assets/dependency-inversion.webp'
---

**"Depende de abstracciones, \[no de] concreciones."**

La Inversión de Dependencias es la "D" de los principios [SOLID](https://es.wikipedia.org/wiki/SOLID), promovidos por [Robert C. Martin](https://es.wikipedia.org/wiki/Robert_C._Martin).

Existen muchos artículos que hablan sobre este principio, pero aquí quiero explicarlo de la forma más sencilla posible mediante un ejemplo.

Cuando crees un nuevo servicio, **empieza por definir su `interfaz`**, y luego implementa esa interfaz en una `clase`.

## Ejemplo

Un servicio que calcula la media de dos números.

La interfaz define el contrato que siempre se respetará:

```php
interface AverageCalculator
{
    public function calculate(float $first, float $second): float;
}
```

A continuación, la implementación (que puede ser cualquier cosa… una llamada a una API externa, una librería de terceros o tu propia lógica):

```php
use AverageCalculator;

class InMemoryAverageCalculator implements AverageCalculator
{
    public function calculate(float $first, float $second): float
    {
        return ($first + $second) / 2;
    }
}
```

Cuando lo inyectes en un controlador, **nunca inyectes la clase concreta**, sino la interfaz. Deja que el `Service Container` se encargue de resolver la implementación adecuada.

```php
use AverageCalculator;

class Somewhere
{
    private AverageCalculator $calculator;

    public function __construct(AverageCalculator $calculator)
    {
        $this->calculator = $calculator;
    }

    public function __invoke(float $first, float $second): float
    {
        return $this->calculator->calculate($first, $second);
    }
}
```

El `Service Container` sabe cuál es la implementación concreta (en este caso, `InMemoryAverageCalculator`), por lo que solo necesitamos configurarlo si es necesario.

## Beneficios

Este enfoque tiene múltiples ventajas:

* Te obliga desde el primer momento a definir un contrato (interfaz), lo que te ayuda a clarificar qué necesitas.
* Puedes cambiar la implementación en cualquier momento sin tener que modificar el resto del código donde se utiliza.
* Las concreciones no afectan al diseño de tu aplicación, ya que la interfaz define claramente las entradas y salidas esperadas.

## Conclusión

Cuando inyectas una interfaz, estás **dependiendo de una abstracción**. No defines la clase que implementa la lógica, sino qué esperar de ella.

Esto aporta una gran **flexibilidad** y facilita la **adaptación a los cambios**.

Recuerda:

* **Abstracción === Interfaz**
* **Concreción === Clase con implementación**
