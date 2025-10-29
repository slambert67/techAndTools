// union is A or B. Intersection is A and B

interface Skier {
    slide(): void;
}

interface Shooter {
    shoot(): void;
}

type Biathlete = Skier & Shooter;
