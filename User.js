const { Entity, PrimaryGeneratedColumn, Column } = require('typeorm');

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id;

  @Column()
  username;

  @Column()
  email;

  // Other fields and methods
}

module.exports = User;
