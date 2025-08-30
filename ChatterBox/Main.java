class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    @Override
    void sound() {
        System.out.println("Dog barks");
    }
}

class Cat extends Animal {
    @Override
    void sound() {
        System.out.println("Cat meows");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal a;   // reference of parent class

        a = new Dog();  
        a.sound();   // Dog barks (runtime decision)

        a = new Cat();  
        a.sound();   // Cat meows (runtime decision)
    }
}
