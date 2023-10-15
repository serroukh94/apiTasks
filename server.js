const express = require('express');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware pour parser le body des requêtes
app.use(bodyParser.json());

// Endpoints

// Récupérer toutes les tâches
app.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des tâches:", err);
            return res.status(500).send('Erreur lors de la récupération des tâches');
        }
        res.json(results);
    });
});

// Récupérer les tâches non faites
app.get('/tasks/undone', (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE done = 0';
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Erreur lors de la récupération des tâches non faites:", err);
            return res.status(500).send('Erreur lors de la récupération des tâches non faites');
        }
        res.json(results);
    });
});

// Ajouter une nouvelle tâche
app.post('/tasks', (req, res) => {
    const task = {
        description: req.body.description,
        done: 0 
    };
    const sql = 'INSERT INTO tasks SET ?';
    db.query(sql, task, (err, result) => {
        if (err) {
            console.error("Erreur lors de l'ajout de la tâche:", err);
            return res.status(500).send('Erreur lors de l\'ajout de la tâche');
        }
        res.json({ id: result.insertId, ...task });
    });
});

// Marquer une tâche comme faite
app.put('/tasks/:id/done', (req, res) => {
    const sql = 'UPDATE tasks SET done = 1 WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la mise à jour de la tâche:", err);
            return res.status(500).send('Erreur lors de la mise à jour de la tâche');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Tâche non trouvée');
        }
        res.send('Tâche mise à jour avec succès');
    });
});

// Modifier une tâche
app.put('/tasks/:id', (req, res) => {
    const sql = 'UPDATE tasks SET description = ? WHERE id = ?';
    db.query(sql, [req.body.description, req.params.id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la modification de la tâche:", err);
            return res.status(500).send('Erreur lors de la modification de la tâche');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Tâche non trouvée');
        }
        res.send('Tâche modifiée avec succès');
    });
});

// Supprimer une tâche (bonus)
app.delete('/tasks/:id', (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            console.error("Erreur lors de la suppression de la tâche:", err);
            return res.status(500).send('Erreur lors de la suppression de la tâche');
        }
        if (result.affectedRows === 0) {
            return res.status(404).send('Tâche non trouvée');
        }
        res.send('Tâche supprimée avec succès');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
