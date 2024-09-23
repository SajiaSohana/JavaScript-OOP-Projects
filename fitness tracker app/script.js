// Base Activity Class
class Activity {
    constructor(type, details) {
        this.type = type;
        this.details = details;
    }

    getDetails() {
        return `${this.type}: ${this.details}`;
    }
}

// Subclasses for each activity type
class Running extends Activity {
    constructor(details) {
        super('Running', details);
    }
    getDetails() {
        return `🏃‍♂️ ${super.getDetails()}`;
    }
}

class Swimming extends Activity {
    constructor(details) {
        super('Swimming', details);
    }
    getDetails() {
        return `🏊‍♀️ ${super.getDetails()}`;
    }
}

class Weightlifting extends Activity {
    constructor(details) {
        super('Weightlifting', details);
    }
    getDetails() {
        return `🏋️‍♂️ ${super.getDetails()}`;
    }
}

class Cycling extends Activity {
    constructor(details) {
        super('Cycling', details);
    }
    getDetails() {
        return `🚴‍♂️ ${super.getDetails()}`;
    }
}

class Yoga extends Activity {
    constructor(details) {
        super('Yoga', details);
    }
    getDetails() {
        return `🧘‍♀️ ${super.getDetails()}`;
    }
}

class Dance extends Activity {
    constructor(details) {
        super('Dance', details);
    }
    getDetails() {
        return `💃 ${super.getDetails()}`;
    }
}

// Fitness Tracker App
class FitnessTracker {
    constructor() {
        this.activities = this.loadActivities() || [];
        this.displayActivities();
    }

    addActivity(activity) {
        this.activities.push(activity);
        this.saveActivities();
        this.displayActivities();
    }

    deleteActivity(index) {
        this.activities.splice(index, 1);
        this.saveActivities();
        this.displayActivities();
    }

    displayActivities() {
        const activityList = document.getElementById('activityList');
        activityList.innerHTML = '';

        this.activities.forEach((activity, index) => {
            const activityCard = document.createElement('div');
            let cardClass = '';

            // Check the type of activity and assign class
            if (activity instanceof Running) {
                cardClass = 'running';
            } else if (activity instanceof Swimming) {
                cardClass = 'swimming';
            } else if (activity instanceof Weightlifting) {
                cardClass = 'weightlifting';
            } else if (activity instanceof Cycling) {
                cardClass = 'cycling';
            } else if (activity instanceof Yoga) {
                cardClass = 'yoga';
            } else if (activity instanceof Dance) {
                cardClass = 'dance';
            }

            activityCard.classList.add('card', cardClass, 'col-12', 'col-md-6', 'col-lg-4', 'p-3', 'mb-3');
            activityCard.innerHTML = `
                <h5>${activity.getDetails()}</h5>
                <div class="button-container">
                    <button class="btn btn-edit" onclick="tracker.editActivity(${index})">
                        <i class="fas fa-pencil-alt"></i> Edit
                    </button>
                    <button class="btn btn-delete" onclick="tracker.deleteActivity(${index})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            activityList.appendChild(activityCard);
        });
    }

    saveActivities() {
        localStorage.setItem('activities', JSON.stringify(this.activities));
    }

    loadActivities() {
        const storedActivities = JSON.parse(localStorage.getItem('activities'));

        if (storedActivities) {
            return storedActivities.map(activity => {
                if (activity.type === 'Running') {
                    return new Running(activity.details);
                } else if (activity.type === 'Swimming') {
                    return new Swimming(activity.details);
                } else if (activity.type === 'Weightlifting') {
                    return new Weightlifting(activity.details);
                } else if (activity.type === 'Cycling') {
                    return new Cycling(activity.details);
                } else if (activity.type === 'Yoga') {
                    return new Yoga(activity.details);
                } else if (activity.type === 'Dance') {
                    return new Dance(activity.details);
                } else {
                    return new Activity(activity.type, activity.details);
                }
            });
        }

        return [];
    }

    editActivity(index) {
        const activity = this.activities[index];
        document.getElementById('activityType').value = activity.type;
        document.getElementById('activityDetails').value = activity.details;

        this.deleteActivity(index);
    }
}

// Instantiate the fitness tracker
const tracker = new FitnessTracker();

// Add Activity Button Click Handler
document.getElementById('addActivity').addEventListener('click', () => {
    const activityType = document.getElementById('activityType').value;
    const activityDetails = document.getElementById('activityDetails').value;

    let newActivity;
    if (activityType === 'Running') {
        newActivity = new Running(activityDetails);
    } else if (activityType === 'Swimming') {
        newActivity = new Swimming(activityDetails);
    } else if (activityType === 'Weightlifting') {
        newActivity = new Weightlifting(activityDetails);
    } else if (activityType === 'Cycling') {
        newActivity = new Cycling(activityDetails);
    } else if (activityType === 'Yoga') {
        newActivity = new Yoga(activityDetails);
    } else if (activityType === 'Dance') {
        newActivity = new Dance(activityDetails);
    }

    if (newActivity) {
        tracker.addActivity(newActivity);
        document.getElementById('activityDetails').value = ''; // Reset input field
    } else {
        console.error('Failed to create new activity: No activity type selected.');
    }
});
