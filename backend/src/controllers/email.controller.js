const nodemailer = require('nodemailer');
const emailController = {}

emailController.sendEmail = (email, message, subject) => {
    //el servidor envía el password generado por email
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            type: 'OAuth2',
            user: 'softgym94@gmail.com',
            clientId: '897886035596-9j7jj8povq78vjb21lvuefsngkcrtm7a.apps.googleusercontent.com',
            clientSecret: 'tRIysHIbZJ6G8mDcpjT3vy2n',
            refreshToken: '1/-7OXgpxE9eZ8L3hkFWYt_mM2_FUwaQhBEzJCcETLXUE'
        }
    });

    var mailOptions = {
        from: 'SoftGym <softgym94@gmail.com>',
        to: `${email}`,
        subject: `${subject}`,
        text: 'Notificación de nuevo usuario',
        html: `${message}`
    }

    transporter.sendMail(mailOptions, function(err, res){
        if(err){
            return console.log('Error' + err);
        }else{
            return true;
        }
    })
}

module.exports = emailController;