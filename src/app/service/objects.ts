export class User {
    username: string;

    constructor(username: string) {
        this.username = username;
    }
}

export class Activity {
    createdAt: Date;
    provider: string;
    channel: string;
    type: string;
    id: string;
    sortingActivityName: string;

    constructor(createdAt: Date, provider: string, channel: string, type: string, id: string, sortingActivityName: string) {
        this.createdAt = createdAt;
        this.provider = provider;
        this.channel = channel;
        this.type = type;
        this.id = id;
        this.sortingActivityName = sortingActivityName;
    }
}

export class Tip {
    tipId: string;
    amount: number;
    currency: string;
    message: string;
    activity: Activity;
    user: User;

    constructor(tipId: string, amount: number, currency: string, message: string, activity: Activity, user: User) {
        this.tipId = tipId;
        this.amount = amount;
        this.currency = currency;
        this.message = message;
        this.activity = activity;
        this.user = user;
    }
}

export class Subscription {
    amount: number;
    tier: string;
    message: string;
    gifted: boolean;
    activity: Activity;
    user: User;
    sender: User | null;

    constructor(amount: number, tier: string, message: string, gifted: boolean, activity: Activity, user: User, sender: User | null) {
        this.amount = amount;
        this.tier = tier;
        this.message = message;
        this.gifted = gifted;
        this.activity = activity;
        this.user = user;
        this.sender = sender;
    }
}

export class Cheer {
    amount: number;
    message: string;
    activity: Activity;
    user: User;

    constructor(amount: number, message: string, activity: Activity, user: User) {
        this.amount = amount;
        this.message = message;
        this.activity = activity;
        this.user = user;
    }
}

export class Follower {
    activity: Activity;
    user: User;

    constructor(activity: Activity, user: User) {
        this.activity = activity;
        this.user = user;
    }
}

export class Host {
    amount: number;
    activity: Activity;
    user: User;

    constructor(amount: number, activity: Activity, user: User) {
        this.amount = amount;
        this.activity = activity;
        this.user = user;
    }
}

export class Raid {
    amount: number;
    activity: Activity;
    user: User;

    constructor(amount: number, activity: Activity, user: User) {
        this.amount = amount;
        this.activity = activity;
        this.user = user;
    }
}