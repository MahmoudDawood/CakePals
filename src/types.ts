export interface Baker {
	id: string;
	firstName?: string;
	lastName?: string;
	userName: string;
	email: string;
	password: string;
	rating: number;
	collectionStart: number;
	collectionEnd: number;
}

export interface Member {
	id: string;
	firstName?: string;
	lastName?: string;
	userName: string;
	email: string;
	password: string;
}

export interface Product {
	id: string;
	bakerId: string;
	type: string;
	duration: number;
}

export interface Order {
	id: string;
	memberId: string;
	bakerId: string;
	productId: string;
	state: OrderState;
	payment: string;
	collectionTime: number;
}

enum OrderState {
	pending = "PENDING",
	accepted = "ACCEPTED",
	rejected = "REJECTED",
	fulfilled = "FULFILLED",
}
