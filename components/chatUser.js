import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
});

export default function ChatUser(props) {
  const classes = useStyles();

  return (
    <li className="user-list pt-1" id={props.id}>
    <Card className={classes.root} variant="outlined" id={props.id}>
      <CardActionArea>
        <div id={props.id} className="d-flex align-items-center ms-2" onClick={props.onClick}>
        <Avatar alt={props.name} src={props.src} id={props.id}/>
         <CardContent id={props.id}>
          <Typography gutterBottom variant="p" component="b" id={props.id}>
            {props.name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" id={props.id}>
            {props.mesaj}
          </Typography>
        </CardContent>
        </div>
       
      </CardActionArea>
    </Card>
    </li>
  );
}
