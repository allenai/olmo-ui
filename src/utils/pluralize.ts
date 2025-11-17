export function pluralize(count: number, singular: string, plural: string = singular + 's') {
    const pluralRules = new Intl.PluralRules('en-US'); // Use the user's locale here
    const rule = pluralRules.select(count);

    const messages: Record<Intl.LDMLPluralRule, string> = {
        zero: plural,
        one: singular,
        two: plural,
        few: plural,
        many: plural,
        other: plural,
    };

    return messages[rule];
}
