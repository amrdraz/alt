#RomanticRide

After the fabilous success of PRKEI park and inspired by the popular GUC crushes facebook page, we decided that there isn't enaugh love in our park.

So we decided to add some romance to PARKEI

###Task

To bring some romance you will need to impliment/modify a couple of new things

####For Amusers

You can Start by implimenting the `Romantic` interface.

- Only Amusers of type `Adult` and `Senior` impliment the `Romantic` interface
- The Romantic interface has 2 mehtods it imposes on its implimentors
	- public void hug();
	- public int getConnectionAmount();

The catch is Adults and Seniors both interpret the strength of a realthionship differently
so take care that for an **Adult** when they hug they're `love` increases, while for a **Senior** their `affection` is what increases.

you'll need to impliment *love* and *affection* respectivly inside their relevent class;

####For Rides


Now that we have romantic Amusers in PARKEI we need to gave them a sapce to practice romance.

You need to create a new *FunRide* called **RomanticRide**

- romantic rides can't be initialized only classes that inherit from it can.
- RomanticRide has to child rides **LoveTunnel** and **Dancerina**
- in addition to it's FunRide behaviore RomanticRides have some constrains
	- only couples can board a romantic ride, should an amuser attempt to board one alone they would get a CouplesOnlyException
	- only **Romantic** people are eligable to board a **RomanticRide**
- RomanticRides make it's riders happy.
- when a RomanticRide starts it's riders will hug.