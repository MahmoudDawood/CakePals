export interface Baker {
	id: string;
	firstName?: string;
	lastName?: string;
	email: string;
	password: string;
	rating: number;
	collectionStart: number;
	collectionEnd: number;
	latitude: string;
	longitude: string;
}

export interface Member {
	id: string;
	firstName?: string;
	lastName?: string;
	email: string;
	password: string;
	latitude: string;
	longitude: string;
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

export enum OrderState {
	pending = "PENDING",
	accepted = "ACCEPTED",
	rejected = "REJECTED",
	fulfilled = "FULFILLED",
}
