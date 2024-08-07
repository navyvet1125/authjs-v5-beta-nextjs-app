import { generateUsername} from 'unique-username-generator';

export const createFullName = () => {
    const name = generateUsername(" ");
    return name
      .split(" ")
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
}
