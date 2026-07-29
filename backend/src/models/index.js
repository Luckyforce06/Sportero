const { sequelize } = require('../config/db');
const Workout = require('./Workout');
const Exercice = require('./Exercice');
const WorkoutExercice = require('./WorkoutExercice');
const User = require('./User');
const Friendship = require('./Friendship');

// Associations
Workout.belongsToMany(Exercice, { through: WorkoutExercice, as: 'Exercises', onDelete: 'CASCADE' });
Exercice.belongsToMany(Workout, { through: WorkoutExercice, as: 'Workouts' });

User.belongsToMany(User, {
  as: 'Friends',
  through: Friendship,
  foreignKey: 'userId',
  otherKey: 'friendId'
});

Workout.hasMany(WorkoutExercice);
WorkoutExercice.belongsTo(Workout);
Exercice.hasMany(WorkoutExercice);
WorkoutExercice.belongsTo(Exercice);

Friendship.belongsTo(User, { as: 'Sender', foreignKey: 'userId' });
Friendship.belongsTo(User, { as: 'Receiver', foreignKey: 'friendId' });

module.exports = {
  sequelize,
  Workout,
  Exercice,
  WorkoutExercice,
  User,
  Friendship
};
