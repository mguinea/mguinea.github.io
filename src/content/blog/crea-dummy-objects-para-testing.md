---
title: 'Crea objetos dummy para hacer buenos tests'
description: 'Crea objetos dummy para hacer buenos tests usando el patron Mother'
pubDate: 'Aug 12 2021'
heroImage: '../../assets/dummy-objects.webp'
---

Cuando probamos nuestra aplicación, normalmente necesitamos utilizar objetos con datos falsos (dummy) para cubrir la mayor cantidad posible de combinaciones.

Aquí es donde entra en juego el patrón `Object Mother`.

## Caso de uso

Imaginemos que tenemos las siguientes clases que necesitaremos en cualquiera de nuestros tests:

```php
class UserName
{
	public function __construct(private string $value)
	{
	}

	public function value(): string
	{
		return $this->value;
	}
}

class User
{
	public function __construct(private UserName $name)
	{
	}

	public function name(): UserName
	{
		return $this->name;
	}
}
```

Como se puede ver, tenemos una *clase entidad* llamada `User`, que contiene un *value object* llamado `UserName`, correspondiente al atributo `name`.

En lugar de forzar un valor concreto en cada test (lo que los haría débiles, ya que siempre probarían con los mismos datos), podemos utilizar el patrón `Object Mother`.

El patrón `Object Mother` nos da la ventaja de generar automáticamente datos falsos, pero también permite forzar un valor específico si es necesario.

## Implementación

En nuestro caso de ejemplo, necesitaremos las clases `UserNameMother` y `UserMother`. Veamos cómo implementarlas:

```php
class UserNameMother
{
	public static function create(?string $value = null): UserName
	{
		$random = ['Marc', 'Anna', 'Júlia', 'Ivet'];

		return new UserName($value ?? $random[rand(0, count($random) - 1)]);
	}
}

class UserMother
{
	public static function create(?UserName $name = null): User
	{
		return new User($name ?? UserNameMother::create());
	}
}
```

Hemos definido cuatro nombres diferentes que se asignarán aleatoriamente. Sin embargo, usando un generador de datos falsos como [FakerPHP](https://fakerphp.github.io/), podemos generar una cantidad mucho mayor de datos.

## Uso

Veamos cómo usar este patrón en nuestros tests:

```php
class SomeTest extends TestCase
{
    /** @test */
    public function itShouldAssertSomething(): void
    {
    	$user = UserMother::create();

    	$this->assertNotNull($user->name());
    }
}
```

A veces necesitamos que un atributo no sea aleatorio. En ese caso, podemos forzar su valor. En el siguiente ejemplo, forzamos que el nombre sea `'John'`:

```php
class SomeTest extends TestCase
{
    /** @test */
    public function itShouldAssertSomething(): void
    {
    	$user = UserMother::create(
    		UserNameMother::create('John')
    	);

    	$this->assertEquals('John', $user->name()->value());
    }
}
```

Si tuviéramos más atributos, según el test podríamos combinar valores aleatorios y valores fijos.

## Conclusión

Nuestro ejemplo es muy simple y casi trivial, pero imagina la flexibilidad que ofrece este enfoque: tus tests pueden utilizar una gran variedad de combinaciones cuando sea necesario, otorgándoles mayor solidez y cobertura.
