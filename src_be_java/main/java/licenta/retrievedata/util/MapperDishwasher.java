package licenta.retrievedata.util;

import licenta.retrievedata.entitites.Device;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import licenta.retrievedata.entitites.RetrievedData;


@Service
public class MapperDishwasher {

    public Device convertToDishwasher(RetrievedData retrievedData){
        Device newDevice = new Device();
        newDevice.setName(retrievedData.getTitle());
        newDevice.setCategory(takeCategory(retrievedData.getDescription()));
        newDevice.setPrice(BigDecimal.valueOf(retrievedData.getPrice()));
        newDevice.setUrl(retrievedData.getUrl());
        newDevice.setImageUrl(retrievedData.getImageUrl());
        newDevice.setConsumption(extractEnergyConsumption(retrievedData.getDescription()));
        newDevice.setConsumptionClass(extractConsumptionClass(retrievedData.getTitle()));
        newDevice.setHeight(takeHeight(retrievedData.getDescription()));
        newDevice.setWidth(takeWidth(retrievedData.getDescription()));
        newDevice.setLength(takeLength(retrievedData.getDescription()));
        return newDevice;

    }

    private String extractConsumptionClass(String input){

        String patternString = "Clasa eficienta energetica\\s+([^\n]+)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return matcher.group(1).trim();
        } else {
            return "invalid clasa";
        }

    }

    private double extractEnergyConsumption (String input){

        String patternString1 = "Consum energetic \\(100 cicluri\\)\\s*(\\d+\\.?\\d*)\\s*kWh";
        String patternString2 = "Consum energetic \\(100 cicluri\\)\\s*(\\d+\\.?\\d*)\\s*kWH";
        String patternString3 = "Consum energetic \\(100 cicluri\\)\\s*(\\d+\\.?\\d*)";
        String patternString4 = "Consum energetic \\(100 cicluri\\)\\s*(\\d+\\.?\\d*)\\s*Wh";
        String patternString5 = "Consum de apa \\(l/ciclu\\)\\s*(\\d+\\.?\\d*)";

        Pattern pattern1 = Pattern.compile(patternString1, Pattern.CASE_INSENSITIVE);
        Pattern pattern2 = Pattern.compile(patternString2, Pattern.CASE_INSENSITIVE);
        Pattern pattern3 = Pattern.compile(patternString3, Pattern.CASE_INSENSITIVE);
        Pattern pattern4 = Pattern.compile(patternString4, Pattern.CASE_INSENSITIVE);
        Pattern pattern5 = Pattern.compile(patternString5, Pattern.CASE_INSENSITIVE);

        Matcher matcher1 = pattern1.matcher(input);
        Matcher matcher2 = pattern2.matcher(input);
        Matcher matcher3 = pattern3.matcher(input);
        Matcher matcher4 = pattern4.matcher(input);
        Matcher matcher5 = pattern5.matcher(input);

        if (matcher1.find()) {
            return Double.parseDouble(matcher1.group(1));
        }

        if (matcher2.find()) {
            return Double.parseDouble(matcher2.group(1));
        }

        if (matcher3.find()) {
            return Double.parseDouble(matcher3.group(1));
        }

        if (matcher4.find()) {
            return Double.parseDouble(matcher4.group(1));
        }

        if (matcher5.find()) {
            return Double.parseDouble(matcher5.group(1))*100;
        }

        return -1.0;

    }

    private String takeCategory(String input){
        String patternString = "Tip\\s+([^\\n]+)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return "Masina de Spalat Vase " + matcher.group(1).trim();
        } else {
            return "invalid categorie";
        }

    }

    private Double takeHeight(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(3));
        } else {
            return 0.0;
        }

    }

    private Double takeWidth(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(2));
        } else {
            return 0.0;
        }

    }

    private Double takeLength(String input){
        String patternString = "Dimensiuni \\(L x A x I cm\\)\\s+(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)\\s*x\\s*(\\d+\\.?\\d*)";
        Pattern pattern = Pattern.compile(patternString);
        Matcher matcher = pattern.matcher(input);

        if (matcher.find()) {
            return Double.parseDouble(matcher.group(1));
        } else {
            return 0.0;
        }

    }
}
