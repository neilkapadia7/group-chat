let users = [];

module.exports = {
    addUser ({ id, name, room }) {
        if (!name || !room) return { error: "name and room required." };
        const user = { id, name, room };
      
        users.push(user);
      
        return { user };
    },

    removeUser (id) {
        const index = users.findIndex((user) => user.id === id);
        return users[index];
    }
};