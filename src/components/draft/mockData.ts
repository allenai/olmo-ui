import { MentionData } from '@draft-js-plugins/mention';
import { RawDraftContentState } from 'draft-js';

// todo: get this from the api
export const mockChips: MentionData[] = [
    {
        name: 'Chicken Jokes',
        content:
            'Why did Chicken Little cross the road? \nTo warn the people on the other side that the sky was falling. \n\n Why did the chicken cross the road? \nTo bock traffic. \n\n Why did the chicken cross the playground? \nTo get to the other slide. \n\n Why did the chicken cross the road? \nI don’t know, why? \nI don’t know—I asked you! \n\nWhy did the chicken cross the road? \nNo one knows. But the road will have its vengeance!! \n\nWhy did the rubber chicken cross the road? \nTo stretch her legs.',
    },
    {
        name: 'Top 250 Movies',
        content:
            'Top 250 Movies \n"The Shawshank Redemption", "The Godfather", "The Godfather: Part II", "The Dark Knight", "12 Angry Men", "Schindler\'s List", "Pulp Fiction", "The Good, the Bad and the Ugly", "The Lord of the Rings: The Return of the King", "Fight Club", "The Lord of the Rings: The Fellowship of the Ring", "Star Wars: Episode V - The Empire Strikes Back", "Forrest Gump", "Inception", "One Flew Over the Cuckoo\'s Nest", "The Lord of the Rings: The Two Towers", "Goodfellas", "The Matrix", "Star Wars", "Seven Samurai", "City of God", "Se7en", "The Silence of the Lambs", "The Usual Suspects", "It\'s a Wonderful Life", "Life Is Beautiful", "Léon: The Professional", "Once Upon a Time in the West", "Interstellar", "Saving Private Ryan", "American History X", "Spirited Away", "Casablanca", "Raiders of the Lost Ark", "Psycho", "City Lights", "Rear Window", "The Intouchables", "Modern Times", "Terminator 2: Judgment Day", "Whiplash", "The Green Mile", "The Pianist", "Memento", "The Departed", "Gladiator", "Apocalypse Now", "Back to the Future", "Sunset Blvd.", "Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb", "The Prestige", "Alien", "The Lion King", "The Lives of Others", "The Great Dictator", "Inside Out", "Cinema Paradiso", "The Shining", "Paths of Glory", "Django Unchained", "The Dark Knight Rises", "WALL·E", "American Beauty", "Grave of the Fireflies", "Aliens", "Citizen Kane", "North by Northwest", "Princess Mononoke", "Vertigo", "Oldeuboi", "Das Boot", "M", "Star Wars: Episode VI - Return of the Jedi", "Once Upon a Time in America", "Amélie", "Witness for the Prosecution", "Reservoir Dogs", "Braveheart", "Toy Story 3", "A Clockwork Orange", "Double Indemnity", "Taxi Driver", "Requiem for a Dream", "To Kill a Mockingbird", "Lawrence of Arabia", "Eternal Sunshine of the Spotless Mind", "Full Metal Jacket", "The Sting", "Amadeus", "Bicycle Thieves", "Singin\' in the Rain", "Monty Python and the Holy Grail", "Snatch.", "2001: A Space Odyssey", "The Kid", "L.A. Confidential", "Rashômon", "For a Few Dollars More", "Toy Story", "The Apartment", "Inglourious Basterds", "All About Eve", "The Treasure of the Sierra Madre", "Jodaeiye Nader az Simin", "Indiana Jones and the Last Crusade", "Metropolis", "Yojimbo", "The Third Man", "Batman Begins", "Scarface", "Some Like It Hot", "Unforgiven", "3 Idiots", "Up", "Raging Bull", "Downfall", "Mad Max: Fury Road", "Jagten", "Chinatown", "The Great Escape", "Die Hard", "Good Will Hunting", "Heat", "On the Waterfront", "Pan\'s Labyrinth", "Mr. Smith Goes to Washington", "The Bridge on the River Kwai", "My Neighbor Totoro", "Ran", "The Gold Rush", "Ikiru", "The Seventh Seal", "Blade Runner", "The Secret in Their Eyes", "Wild Strawberries", "The General", "Lock, Stock and Two Smoking Barrels", "The Elephant Man", "Casino", "The Wolf of Wall Street", "Howl\'s Moving Castle", "Warrior", "Gran Torino", "V for Vendetta", "The Big Lebowski", "Rebecca", "Judgment at Nuremberg", "A Beautiful Mind", "Cool Hand Luke", "The Deer Hunter", "How to Train Your Dragon", "Gone with the Wind", "Fargo", "Trainspotting", "It Happened One Night", "Dial M for Murder", "Into the Wild", "Gone Girl", "The Sixth Sense", "Rush", "Finding Nemo", "The Maltese Falcon", "Mary and Max", "No Country for Old Men", "The Thing", "Incendies", "Hotel Rwanda", "Kill Bill: Vol. 1", "Life of Brian", "Platoon", "The Wages of Fear", "Butch Cassidy and the Sundance Kid", "There Will Be Blood", "Network", "Touch of Evil", "The 400 Blows", "Stand by Me", "12 Years a Slave", "The Princess Bride", "Annie Hall", "Persona", "The Grand Budapest Hotel", "Amores Perros", "In the Name of the Father", "Million Dollar Baby", "Ben-Hur", "The Grapes of Wrath", "Hachi: A Dog\'s Tale", "Nausicaä of the Valley of the Wind", "Shutter Island", "Diabolique", "Sin City", "The Wizard of Oz", "Gandhi", "Stalker", "The Bourne Ultimatum", "The Best Years of Our Lives", "Donnie Darko", "Relatos salvajes", "8½", "Strangers on a Train", "Jurassic Park", "The Avengers", "Before Sunrise", "Twelve Monkeys", "The Terminator", "Infernal Affairs", "Jaws", "The Battle of Algiers", "Groundhog Day", "Memories of Murder", "Guardians of the Galaxy", "Monsters, Inc.", "Harry Potter and the Deathly Hallows: Part 2", "Throne of Blood", "The Truman Show", "Fanny and Alexander", "Barry Lyndon", "Rocky", "Dog Day Afternoon", "The Imitation Game", "Yip Man", "The King\'s Speech", "High Noon", "La Haine", "A Fistful of Dollars", "Pirates of the Caribbean: The Curse of the Black Pearl", "Notorious", "Castle in the Sky", "Prisoners", "The Help", "Who\'s Afraid of Virginia Woolf?", "Roman Holiday", "Spring, Summer, Fall, Winter... and Spring", "The Night of the Hunter", "Beauty and the Beast", "La Strada", "Papillon", "X-Men: Days of Future Past", "Before Sunset", "Anatomy of a Murder", "The Hustler", "The Graduate", "The Big Sleep", "Underground", "Elite Squad: The Enemy Within", "Gangs of Wasseypur", "Lagaan: Once Upon a Time in India", "Paris, Texas", "Akira"',
    },
    {
        name: 'Gettysburg Address',
        content:
            'Four score and seven years ago our fathers brought forth on this continent, a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal. \n Now we are engaged in a great civil war, testing whether that nation, or any nation so conceived and so dedicated, can long endure. We are met on a great battle-field of that war. We have come to dedicate a portion of that field, as a final resting place for those who here gave their lives that that nation might live. It is altogether fitting and proper that we should do this. \n But, in a larger sense, we can not dedicate -- we can not consecrate -- we can not hallow -- this ground. The brave men, living and dead, who struggled here, have consecrated it, far above our poor power to add or detract. The world will little note, nor long remember what we say here, but it can never forget what they did here. It is for us the living, rather, to be dedicated here to the unfinished work which they who fought here have thus far so nobly advanced. It is rather for us to be here dedicated to the great task remaining before us -- that from these honored dead we take increased devotion to that cause for which they gave the last full measure of devotion -- that we here highly resolve that these dead shall not have died in vain -- that this nation, under God, shall have a new birth of freedom -- and that government of the people, by the people, for the people, shall not perish from the earth.',
    },
];

// todo: get this from the api
export const mockRawData: RawDraftContentState = {
    blocks: [
        {
            key: 'glbo',
            text: 'test Chicken Jokes and Gettysburg Address. hi there!',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [
                { offset: 5, length: 13, key: 0 },
                { offset: 23, length: 18, key: 1 },
            ],
            data: {},
        },
    ],
    entityMap: {
        '0': {
            type: 'mention',
            mutability: 'IMMUTABLE',
            data: {
                mention: mockChips[0],
            },
        },
        '1': {
            type: 'mention',
            mutability: 'IMMUTABLE',
            data: {
                mention: mockChips[2],
            },
        },
    },
};
