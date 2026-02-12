import { 
    createUser, 
    getAllUsers, 
    getUserById, 
    updateUser, 
    deleteUser,
    getChauffeurs

} from "../services/userService.js";

export const CreateUser = async (req, res) => {
    try {
        console.log(req.body);
        const user = await createUser(req.body);

        res.status(201).json({
            success: true,
            data: user
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filters = role ? { role } : {};
        
        const users = await getAllUsers(filters);

        res.status(200).json({
            success: true,
            count: users.length,
            data: users
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getUserById(id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch(err) {
        res.status(404).json({
            success: false,
            message: err.message
        });
    }
}

export const UpdateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await updateUser(id, req.body);

        res.status(200).json({
            success: true,
            message: 'Utilisateur modifié avec succès',
            data: user
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const DeleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await deleteUser(id);

        res.status(200).json({
            success: true,
            message: 'Utilisateur supprimé avec succès',
            data: user
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const GetChauffeurs = async (req, res) => {
    try {
        const chauffeurs = await getChauffeurs();

        res.status(200).json({
            success: true,
            count: chauffeurs.length,
            data: chauffeurs
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
}