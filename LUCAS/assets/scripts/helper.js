let gcd = (a, b) => {
	while (b) [a, b] = [b, a % b];
	return a;
};

let lcm = (a, b) => {
	return a * b / gcd(a, b);
};