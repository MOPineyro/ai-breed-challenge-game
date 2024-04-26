interface Question {
    imageUrl: string;
    type: string;
    breed: string;
    selections: Selection[];
}

interface Selection {
    name: string;
    key: string;
}